let Service, Characteristic;
const sendJsonCreate = require ('./send_JSON_create.js');
const cron           = require ('node-cron');
const elasticsearch  = require ('elasticsearch');
const NatureRemo     = require ('natureremo_cloud_sensor');
const SBCloud        = require ('switchbot_cloud_wosensorth');
const SBLocal        = require ('switchbot_local_wosensorth');
const CheTPHU5       = require ('sanwa_che-tphu5');
const MH_Z19         = require ('mh_z19');
const ZH06           = require ('zh06');

module.exports = function(homebridge){
  Service           = homebridge.hap.Service;
  Characteristic    = homebridge.hap.Characteristic;
  homebridge.registerAccessory ("homebridge-sensor", "Sensor", SensorAccessory);
}

function SensorAccessory (log, config) {
  this.log                           = log;
  this.name                          = config ["name"];
  this.schedule                      = config ["schedule"]                                     || '30 */5 * * * *';
  this.acquisition_interval          = config ["acquisition_interval"]                         || 500;
  this.service                       = [];
  this.informationService            = new Service.AccessoryInformation ();

  this.informationService
    .setCharacteristic (Characteristic.Manufacturer, "Sensor Manufacturer")
    .setCharacteristic (Characteristic.Model, 'Sensozr Model')
    .setCharacteristic (Characteristic.SerialNumber, 'Sensor Serial Number');
  this.service.push (this.informationService);

//---- Temperature Sensor ----------------------------------------------------------------
  this.indicate_te_sensor            = config ["indicate_te_sensor"]                           || true;
  this.temperature                   = config ["temperature"]
  if (this.indicate_te_sensor) {
    this.te_val                      = null;
    this.te_sensor                   = this.temperature ["sensor"];
    switch (this.te_sensor) {
      case "nature_remo":
        this.nr_access_token         = this.temperature.nature_remo ["access_token"];
        this.nr_device_name          = this.temperature.nature_remo ["device_name"];
        break;
      case "switch_bot":
        this.sb_access_token         = config.temperature.switch_bot ["access_token"];
        this.sb_device_id            = config.temperature.switch_bot ["device_id"];
        break;
      case "switch_bot_cloud":
        this.sb_access_token         = config.temperature.switch_bot_cloud ["access_token"];
        this.sb_device_id            = config.temperature.switch_bot_cloud ["device_id"];
        break;
      case "switch_bot_local":
        this.sb_ble_mac              = config.temperature.switch_bot_local ["ble_mac"];
        this.noble_ctl_path          = config.temperature.switch_bot_local ["noble_ctl_path"]  || "/usr/local/lib/node_modules/homebridge-sensor/node_modules/switchbot_local_wosensorth/";
        break;
      case "che_tphu5":
        this.tp5_ble_mac             = config.temperature.che_tphu5 ["ble_mac"];
        this.noble_ctl_path          = config.temperature.che_tphu5 ["noble_ctl_path"]         || "/usr/local/lib/node_modules/homebridge-sensor/node_modules/sanwa_che-tphu5/";
        break;
      default:
        this.log ("[Error] >>>> * * * The thermometer was turned off because the specified meter could not be found * * *");
        this.indicate_te_sensor      = false;
    };
    this.temperatureSensorService    = new Service.TemperatureSensor (this.name)
    this.service.push (this.temperatureSensorService);
  };

//---- Humidity Sensor -------------------------------------------------------------------
  this.indicate_hu_sensor            = config ["indicate_hu_sensor"]                           || true;
  this.humidity                      = config ["humidity"]
  if (this.indicate_hu_sensor) {
    this.hu_val                      = null;
    this.hu_sensor                   = this.humidity ["sensor"];
    switch (this.hu_sensor) {
      case "nature_remo":
        this.nr_access_token         = this.humidity.nature_remo ["access_token"];
        this.nr_device_id            = this.humidity.nature_remo ["device_id"];
        break;
      case "switch_bot":
      this.sb_access_token         = config.humidity.switch_bot ["access_token"];
      this.sb_device_id            = config.humidity.switch_bot ["device_id"];
      break;
      case "switch_bot_cloud":
        this.sb_access_token         = config.humidity.switch_bot_cloud ["access_token"];
        this.sb_device_id            = config.humidity.switch_bot_cloud ["device_id"];
        break;
      case "switch_bot_local":
        this.sb_ble_mac              = config.humidity.switch_bot_local ["ble_mac"];
        this.noble_ctl_path          = config.humidity.switch_bot_local ["noble_ctl_path"]     || "/usr/local/lib/node_modules/homebridge-sensor/node_modules/switchbot_local_wosensorth/";
        break;
      case "che_tphu5":
        this.tp5_ble_mac             = config.humidity.che_tphu5 ["ble_mac"];
        this.noble_ctl_path          = config.humidity.che_tphu5 ["noble_ctl_path"]            || "/usr/local/lib/node_modules/homebridge-sensor/node_modules/sanwa_che-tphu5/";
        break;
      default:
        this.log ("[Error] >>>> * * * The hygrometer was turned off because the specified meter could not be found * * *");
        this.indicate_hu_sensor      = false;
    };
    this.humiditySensorService       = new Service.HumiditySensor (this.name)
    this.service.push (this.humiditySensorService);
  };

//---- Light Sensor ----------------------------------------------------------------------
  this.indicate_li_sensor            = config ["indicate_li_sensor"]                           || false;
  this.light                         = config ["light"]
  if (this.indicate_li_sensor) {
    this.li_val                      = null;
    this.li_sensor                   = config.light ["sensor"];
    switch (this.li_sensor) {
      case "nature_remo":
        this.nr_access_token         = this.light.nature_remo ["access_token"];
        this.nr_device_id            = this.light.nature_remo ["device_id"];
        break;
      case "che_tphu5":
        this.tp5_ble_mac             = config.light.che_tphu5 ["ble_mac"];
        this.noble_ctl_path          = config.light.che_tphu5 ["noble_ctl_path"]               || "/usr/local/lib/node_modules/homebridge-sensor/node_modules/sanwa_che-tphu5/";
        break;
      default:
        this.log ("[Error] >>>> * * * The illuminance meter was turned off because the specified meter could not be found * * *");
        this.indicate_li_sensor      = false;
    };
    this.lightSensorService          = new Service.LightSensor (this.name)
    this.service.push (this.lightSensorService);
  };

//---- CO2 Sensor ------------------------------------------------------------------------
  this.indicate_co2_sensor           = config ["indicate_co2_sensor"]                          || false;
  if (this.indicate_co2_sensor) {
    this.co2_val                     = null;
    this.co2_detected                = null;
    this.co2_sensor                  = config.co2 ["sensor"];
    switch (this.co2_sensor) {
      case "mh_z19":
        this.mhz19_uart_path         = config.co2.mh_z19 ["uart_path"]                         || "/dev/ttyS0";
        break;
      default:
        this.log ("[Error] >>>> * * * The carbon dioxide sensor was turned off because the specified meter could not be found * * *");
        this.indicate_co2_sensor     = false;
    };
    this.co2_warning_level           = config.co2 ["warning_level"]                            || 1500;
    this.CarbonDioxideSensorService  = new Service.CarbonDioxideSensor (this.name);
    this.service.push (this.CarbonDioxideSensorService);
  };

//---- CO Sensor -------------------------------------------------------------------------
  this.indicate_co_sensor            = config ["indicate_co_sensor"]                           || false;
  if (this.indicate_co_sensor) {
    this.co_val                      = null;
    this.co_detected                 = null;
    this.co_sensor                   = config.co ["sensor"];
    switch (this.co_sensor) {
      default:
      this.log ("[Error] >>>> * * * The carbon monoxide sensor was turned off because the specified meter could not be found * * *");
        this.indicate_co_sensor      = false;
    };
    this.co_warning_level            = config.co ["warning_level"]                             || 9;
    this.CarbonMonoxideSensorService = new Service.CarbonMonoxideSensor (this.name);
    this.service.push (this.CarbonMonoxideSensorService);
  };
//---- Air Quality Sensor ----------------------------------------------------------------
  this.E_G_boundary                  = config ["pm_E_G_boundary"]                              || 10
  this.G_F_boundary                  = config ["pm_G_F_boundary"]                              || 15
  this.F_I_boundary                  = config ["pm_F_I_boundary"]                              || 25
  this.I_P_boundary                  = config ["pm_I_P_boundary"]                              || 35
  this.air_quality_num               = null;

//---- PM10 Sensor ----------------------------------------------------------------------
  this.indicate_pm10_sensor          = config ["indicate_pm10_sensor"]                         || false;
  if (this.indicate_pm10_sensor) {
    this.pm10_val                    = null;
    this.air_quality_num1            = null;
    this.pm10_sensor                 = config.pm10 ["sensor"];
    switch (this.pm10_sensor) {
      case "zh06":
        this.zh06_uart_path          = config.pm10.zh06 ["uart_path"]                          || "/dev/ttyS0";
        break;
      default:
        this.log ("[Error] >>>> * * * The PM10 sensor was turned off because the specified meter could not be found * * *");
        this.indicate_pm10_sensor    = false;
    };
  };

//---- PM2.5 Sensor ---------------------------------------------------------------------
    this.indicate_pm2_5_sensor       = config ["indicate_pm2_5_sensor"]                        || false;
    if (this.indicate_pm2_5_sensor) {
      this.pm2_5_val                 = null;
      this.air_quality_num2          = null;
      this.pm2_5_sensor              = config.pm2_5 ["sensor"];
      switch (this.pm2_5_sensor) {
        case "zh06":
          this.zh06_uart_path       = config.pm2_5.zh06 ["uart_path"]                         || "/dev/ttyS0";
          break;
        default:
        this.log ("[Error] >>>> * * * The PM2.5 sensor was turned off because the specified meter could not be found * * *");
          this.indicate_pm2_5_sensor = false;
      };
    };

    if (this.indicate_pm10_sensor   == true || this.indicate_pm2_5_sensor   == true) {
      this.AirQualitySensorService   = new Service.AirQualitySensor (this.name);
      this.service.push (this.AirQualitySensorService);
    };

//---- use_elasticsearch ----------------------------------------------------------
  this.use_elasticsearch             = config ["use_elasticsearch"]                           || false;
  if (this.use_elasticsearch) {
    this.host                        = config.elasticsearch_seting ["host"]                   || 'localhost:9200';
    this.index                       = config.elasticsearch_seting ["index"]                  || 'measured_value';
    this.title                       = config.elasticsearch_seting ["title"]                  || 'measured_value';
    this.date_format                 = config.elasticsearch_seting ["date_format"]            || 'YYYY-MM-DDTHH:mm:ss';
  }

  let job = cron.schedule (this.schedule, () => {
    this.getMeasuredValue ();
  });
}

//----------------------------------------------------------------------------------------
SensorAccessory.prototype.getServices = function () {
  return this.service;
}

//----------------------------------------------------------------------------------------
SensorAccessory.prototype.getMeasuredValue = function () {
  if (this.indicate_te_sensor) {
    switch (this.te_sensor) {
      case "nature_remo":
        this.getNatureRemoMeasuredValue ();
        break;
      case "switch_bot":
      case "switch_bot_cloud":
        this.getSBCloudMeasuredValue ();
        break;
      case "switch_bot_local":
        this.getSBLocalMeasuredValue ();
        break;
      case "che_tphu5":
        this.getCheTphu5MeasuredValue ();
        break;
      default:
    };
  };

  if (this.indicate_hu_sensor) {
    switch (this.hu_sensor) {
      case "nature_remo":
        if (this.te_sensor != "nature_remo") {
          this.getNatureRemoMeasuredValue ();
        }
        break;
      case "switch_bot":
      case "switch_bot_cloud":
        if ((this.te_sensor != "switch_bot") || (this.te_sensor != "switch_bot_cloud")) {
          this.getSBCloudMeasuredValue ();
        }
        break;
      case "switch_bot_local":
        if (this.te_sensor != "switch_bot_local") {
          this.getSBLocalMeasuredValue ();
        }
        break;
      case "che_tphu5":
        if (this.te_sensor != "che_tphu5") {
          this.getCheTphu5MeasuredValue ();
        }
        break;
      default:
    };
  };

  if (this.indicate_li_sensor) {
    switch (this.li_sensor) {
      case "nature_remo":
        if ((this.te_sensor != "nature_remo") || (this.hu_sensor != "nature_remo")) {
          this.getNatureRemoMeasuredValue ();
        }
        break;
      case "che_tphu5":
        if ((this.te_sensor != "che_tphu5") || (this.hu_sensor != "che_tphu5")) {
          this.getCheTphu5MeasuredValue ();
        }
        break;
      default:
    };
  };

  if (this.indicate_co2_sensor) {
    switch (this.co2_sensor) {
      case "mh_z19":
        this.getMhz19MeasuredValue ();
        break;
      default:
    };
  };

  if (this.indicate_co_sensor) {
    switch (this.co_sensor) {
      default:
    };
  };

  if (this.indicate_pm10_sensor) {
    switch (this.pm10_sensor) {
      case "zh06":
        this.getZh06MeasuredValue ();
        break;
      default:
    };
  };

  if (this.indicate_pm2_5_sensor) {
    switch (this.pm2_5_sensor) {
      case "zh06":
        if (this.pm10_sensor != "zh06") {
          this.getZh06MeasuredValue ();
        }
        break;
      default:
    };
  };

  if (this.use_elasticsearch) {
    this.setElasticsearch ();
  };
}

//---- NatureRemo Cloud Sensor -----------------------------------------------------------
SensorAccessory.prototype.getNatureRemoMeasuredValue = function () {
  new NatureRemo (this.nr_access_token, this.nr_device_name, function (error, value, stderr) {
    if (value == null) {
      if (this.te_sensor == "nature_remo") {
        this.log(`<<<< [Error] Temperature`);
        this.temperatureSensorService
          .updateCharacteristic (Characteristic.CurrentTemperature, new Error (error));
      }
      if (this.hu_sensor == "nature_remo") {
        this.log(`<<<< [Error] Humidity`);
        this.humiditySensorService
          .updateCharacteristic (Characteristic.CurrentRelativeHumidity, new Error (error));
      }
      if (this.li_sensor == "nature_remo") {
        this.log(`<<<< [Error] Light Level`);
        this.lightSensorService
          .updateCharacteristic (Characteristic.CurrentAmbientLightLevel, new Error (error));
      }
    }
    else {
      if (this.te_sensor == "nature_remo") {
        this.te_val = value.te
        this.log(`<<<< [Update] Temperature: ${this.te_val}`);
        this.temperatureSensorService
          .updateCharacteristic (Characteristic.CurrentTemperature, this.te_val);
      };
      if (this.hu_sensor == "nature_remo") {
        this.hu_val = value.hu
        this.log(`<<<< [Update] Humidity: ${this.hu_val}`);
        this.humiditySensorService
          .updateCharacteristic (Characteristic.CurrentRelativeHumidity, this.hu_val);
      };
      if (this.li_sensor == "nature_remo") {
        this.li_val = value.li
        this.log(`<<<< [Update] Light Level: ${this.li_val}`);
        this.lightSensorService
        .updateCharacteristic (Characteristic.CurrentAmbientLightLevel, this.li_val);
      };
    };
  }.bind (this));
}

//---- SwitchBot Cloud WoSensorTH --------------------------------------------------------
SensorAccessory.prototype.getSBCloudMeasuredValue = function () {
  new SBCloud (this.sb_access_token, this.sb_device_id, function (error, value, stderr) {
    if (value == null) {
      if ((this.te_sensor == "switch_bot") || (this.te_sensor == "switch_bot_cloud")) {
        this.log(`<<<< [Error] Temperature`);
        this.temperatureSensorService
          .updateCharacteristic (Characteristic.CurrentTemperature, new Error (error));
      }
      if ((this.hu_sensor == "switch_bot") || (this.hu_sensor == "switch_bot_cloud")) {
        this.log(`<<<< [Error] Humidity`);
        this.humiditySensorService
          .updateCharacteristic (Characteristic.CurrentRelativeHumidity, new Error (error));
      }
    }
    else {
      if ((this.te_sensor == "switch_bot") || (this.te_sensor == "switch_bot_cloud")) {
        this.te_val = value.te
        this.log(`<<<< [Update] Temperature: ${this.te_val}`);
        this.temperatureSensorService
          .updateCharacteristic (Characteristic.CurrentTemperature, this.te_val);
      };
      if ((this.hu_sensor == "switch_bot") || (this.hu_sensor == "switch_bot_cloud")) {
        this.hu_val = value.hu
        this.log(`<<<< [Update] Humidity: ${this.hu_val}`);
        this.humiditySensorService
          .updateCharacteristic (Characteristic.CurrentRelativeHumidity, this.hu_val);
      };
    };
  }.bind (this));
}

//---- SwitchBot Local WoSensorTH --------------------------------------------------------
SensorAccessory.prototype.getSBLocalMeasuredValue = function () {
  new SBLocal (this.sb_ble_mac, this.noble_ctl_path, function (error, value, stderr) {
    if (value == null) {
      if (this.te_sensor == "switch_bot_local") {
        this.log(`<<<< [Error] Temperature`);
        this.temperatureSensorService
          .updateCharacteristic (Characteristic.CurrentTemperature, new Error (error));
      }
      if (this.hu_sensor == "switch_bot_local") {
        this.log(`<<<< [Error] Humidity`);
        this.humiditySensorService
          .updateCharacteristic (Characteristic.CurrentRelativeHumidity, new Error (error));
      }
    }
    else {
      if (this.te_sensor == "switch_bot_local") {
        this.te_val = value.te
        this.log(`<<<< [Update] Temperature: ${this.te_val}`);
        this.temperatureSensorService
          .updateCharacteristic (Characteristic.CurrentTemperature, this.te_val);
      };
      if (this.hu_sensor == "switch_bot_local") {
        this.hu_val = value.hu
        this.log(`<<<< [Update] Humidity: ${this.hu_val}`);
        this.humiditySensorService
          .updateCharacteristic (Characteristic.CurrentRelativeHumidity, this.hu_val);
      };
    };
  }.bind (this));
}

//---- Sanwa CHE-TPHU5 -------------------------------------------------------------------
SensorAccessory.prototype.getCheTphu5MeasuredValue = function () {
  new CheTPHU5 (this.tp5_ble_mac, this.noble_ctl_path, function (error, value, stderr) {
    if (value == null) {
      if (this.te_sensor == "che_tphu5") {
        this.log(`<<<< [Error] Temperature`);
        this.temperatureSensorService
          .updateCharacteristic (Characteristic.CurrentTemperature, new Error (error));
      }
      if (this.hu_sensor == "che_tphu5") {
        this.log(`<<<< [Error] Humidity`);
        this.humiditySensorService
          .updateCharacteristic (Characteristic.CurrentRelativeHumidity, new Error (error));
      }
      if (this.li_sensor == "che_tphu5") {
        this.log(`<<<< [Error] Light Level`);
        this.lightSensorService
          .updateCharacteristic (Characteristic.CurrentAmbientLightLevel, new Error (error));
      }
    }
    else {
      if (this.te_sensor == "che_tphu5") {
        this.te_val = value.te
        this.log(`<<<< [Update] Temperature: ${this.te_val}`);
        this.temperatureSensorService
          .updateCharacteristic (Characteristic.CurrentTemperature, this.te_val);
      };
      if (this.hu_sensor == "che_tphu5") {
        this.hu_val = value.hu
        this.log(`<<<< [Update] Humidity: ${this.hu_val}`);
        this.humiditySensorService
          .updateCharacteristic (Characteristic.CurrentRelativeHumidity, this.hu_val);
      };
      if (this.li_sensor == "che_tphu5") {
        this.li_val = value.li
        this.log(`<<<< [Update] Light Level: ${this.li_val}`);
        this.lightSensorService
        .updateCharacteristic (Characteristic.CurrentAmbientLightLevel, this.li_val);
      };
    };
  }.bind (this));
}

//---- MH-Z19 ----------------------------------------------------------------------------
SensorAccessory.prototype.getMhz19MeasuredValue = function () {
  new MH_Z19 (this.mhz19_uart_path, function (error, value, stderr) {
    if (value == null) {
      this.log(`<<<< [Error] Carbon Dioxide Level`);
      this.log(`<<<< [Error] Carbon Dioxide Detected`);
      this.CarbonDioxideSensorService
        .updateCharacteristic (Characteristic.CarbonDioxideLevel, new Error (error));
      this.CarbonDioxideSensorService
        .updateCharacteristic (Characteristic.CarbonDioxideDetected, new Error (error));
    }
    else {
      this.co2_val      = value;
      this.co2_detected = (this.co2_warning_level > this.co2_val) ? 0 : 1;
      this.log(`<<<< [Update] Carbon Dioxide Level: ${this.co2_val}`);
      this.log(`<<<< [Update] Carbon Dioxide Detected: ${this.co2_detected}`);
      this.CarbonDioxideSensorService
        .updateCharacteristic (Characteristic.CarbonDioxideLevel, this.co2_val);
      this.CarbonDioxideSensorService
        .updateCharacteristic (Characteristic.CarbonDioxideDetected, this.co2_detected);
    };
  }.bind (this));
}

//---- ZH06 ----------------------------------------------------------------------------
SensorAccessory.prototype.getZh06MeasuredValue = function () {
  new ZH06 (this.zh06_uart_path, function (error, value, stderr) {
    if (value == null) {
      if (this.pm10_sensor == "zh06") {
        this.AirQualitySensorService
          .updateCharacteristic (Characteristic.AirQuality, 0);
        this.log (`<<<< [Update] Air Quality: UNKNOWN`);
        this.air_quality_num = 0;
        this.AirQualitySensorService
          .updateCharacteristic (Characteristic.PM10Density, new Error (error));
        this.log (`<<<< [Error] Air Quality (PM10)`);
      }
      if (this.pm2_5_sensor == "zh06") {
        this.AirQualitySensorService
          .updateCharacteristic (Characteristic.AirQuality, 0);
        this.log (`<<<< [Update] Air Quality: UNKNOWN`);
        this.air_quality_num = 0;
        this.AirQualitySensorService
          .updateCharacteristic (Characteristic.PM2_5Density, new Error (error));
        this.log (`<<<< [Error] Air Quality (PM2.5)`);
      }
    }
    else {
      if (this.pm10_sensor == "zh06") {
        this.pm10_val         = value.pm10
        this.air_quality_num1 = (this.E_G_boundary < this.pm10_val) ? 2 : 1;
        this.air_quality_num1 = (this.G_F_boundary < this.pm10_val) ? 3 : 1;
        this.air_quality_num1 = (this.F_I_boundary < this.pm10_val) ? 4 : 1;
        this.air_quality_num1 = (this.I_P_boundary < this.pm10_val) ? 5 : 1;
        this.log (`<<<< [Update] PM10 Density: ${this.pm10_val}`);
        this.AirQualitySensorService
          .updateCharacteristic (Characteristic.PM10Density, this.pm10_val);
      };
      if (this.pm2_5_sensor == "zh06") {
        this.pm2_5_val        = value.pm2_5
        this.air_quality_num2 = (this.E_G_boundary < this.pm2_5_val) ? 2 : 1;
        this.air_quality_num2 = (this.G_F_boundary < this.pm2_5_val) ? 3 : 1;
        this.air_quality_num2 = (this.F_I_boundary < this.pm2_5_val) ? 4 : 1;
        this.air_quality_num2 = (this.I_P_boundary < this.pm2_5_val) ? 5 : 1;
        this.log (`<<<< [Update] PM2_5 Density: ${this.pm2_5_val}`);
        this.AirQualitySensorService
          .updateCharacteristic (Characteristic.PM2_5Density, this.pm2_5_val);
      };
    };

    if (this.air_quality_num != 0) {
      if (this.indicate_pm10_sensor == true && this.indicate_pm2_5_sensor == true) {
        this.air_quality_num = Math.round ((this.air_quality_num1 + this.air_quality_num2) / 2)
      }
      else if (this.indicate_pm10_sensor == true) {
        this.air_quality_num = this.air_quality_num1
      }
      else if (this.indicate_pm2_5_sensor == true) {
        this.air_quality_num = this.air_quality_num2
      }
      this.AirQualitySensorService
        .updateCharacteristic (Characteristic.AirQuality, this.air_quality_num);
      switch (this.air_quality_num) {
        case 1:
          this.log(`<<<< [Update] Air Quality: EXCELLENT`);
          break;
        case 2:
          this.log(`<<<< [Update] Air Quality: GOOD`);
          break;
        case 3:
          this.log(`<<<< [Update] Air Quality: FAIR`);
          break;
        case 4:
          this.log(`<<<< [Update] Air Quality: INFERIOR`);
          break;
        case 5:
          this.log(`<<<< [Update] Air Quality: POOR`);
          break;
      }
    }
  }.bind (this));
}

//----------------------------------------------------------------------------------------
SensorAccessory.prototype.setElasticsearch = function () {
  let send_json = sendJsonCreate.main (this.index, this.title, this.date_format, this.indicate_te_sensor, this.te_val, this.indicate_hu_sensor, this.hu_val, this.indicate_li_sensor, this.li_val, this.indicate_co2_sensor, this.co2_val, this.indicate_co_sensor, this.co_val, this.indicate_pm10_sensor, this.pm10_val, this.indicate_pm2_5_sensor, this.pm2_5_val);
  let client    = new elasticsearch.Client ({ host: this.host });

  client.ping ({ requestTimeout: 2000 }, function (error) {
    if (error) {
      this.log (`>>>> [Error] Elasticsearch cluster is down`);
    }
    else {
      client.index (send_json, function (error) {
        if (error) {
          this.log (`>>>> [Error] Elasticsearch`);
        }
        else {
          this.log (`>>>> [Document Input] Elasticsearch`);
        }
      }.bind (this));
    }
  }.bind (this));
}
