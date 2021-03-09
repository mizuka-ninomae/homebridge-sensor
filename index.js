let Service, Characteristic;
const sendJsonCreate = require ('./send_JSON_create.js');
const Promise        = require ('promise');
const cron           = require ('node-cron');
const elasticsearch  = require ('elasticsearch');
const NatureRemo     = require ('natureremo_cloud_sensor');
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
  this.schedule                      = config ["schedule"]                         || '* */5 * * * *';
  this.acquisition_interval          = config ["acquisition_interval"]             || 500;
  this.service                       = [];
  this.informationService            = new Service.AccessoryInformation ();

  this.informationService
    .setCharacteristic (Characteristic.Manufacturer, "Sensor Manufacturer")
    .setCharacteristic (Characteristic.Model, 'Sensozr Model')
    .setCharacteristic (Characteristic.SerialNumber, 'Sensor Serial Number');
  this.service.push (this.informationService);

//---- Temperature Sensor ------------------------------------------------------
  this.indicate_te_sensor            = config ["indicate_te_sensor"]               || true;
  this.temperature                   = config ["temperature"]
  if (this.indicate_te_sensor) {
    this.te_val                      = null;
    this.te_sensor                   = this.temperature ["sensor"];
    switch (this.te_sensor) {
      case "nature_remo":
        this.access_token            = this.temperature.nature_remo ["access_token"];
        this.device_name             = this.temperature.nature_remo ["device_name"];
        break;
//      case 'switch_bot':
//        this.ble_mac                 = config.temperature.switch_bot ["ble_mac"];
      break;
      default:
        this.log ("Error message (provisional)");
        this.indicate_te_sensor      = false;
    };
    this.temperatureSensorService    = new Service.TemperatureSensor (this.name)
    this.service.push (this.temperatureSensorService);
  };

//---- Humidity Sensor ---------------------------------------------------------
  this.indicate_hu_sensor            = config ["indicate_hu_sensor"]               || true;
  this.humidity                      = config ["humidity"]
  if (this.indicate_hu_sensor) {
    this.hu_val                      = null;
    this.hu_sensor                   = this.humidity ["sensor"];
    switch (this.hu_sensor) {
      case "nature_remo":
        this.access_token            = this.humidity.nature_remo ["access_token"];
        this.device_name             = this.humidity.nature_remo ["device_name"];
        break;
//      case 'switch_bot':
//        this.ble_mac                 = config.humidity.switch_bot ["ble_mac"];
      break;
      default:
        this.log ("Error message (provisional)");
        this.indicate_hu_sensor      = false;
    };
    this.humiditySensorService       = new Service.HumiditySensor (this.name)
    this.service.push (this.humiditySensorService);
  };

//---- Light Sensor ------------------------------------------------------------
  this.indicate_li_sensor            = config ["indicate_li_sensor"]               || false;
  this.light                         = config ["light"]
  if (this.indicate_li_sensor) {
    this.li_val                      = null;
    this.li_sensor                   = config.light ["sensor"];
    switch (this.li_sensor) {
      case "nature_remo":
        this.access_token            = this.light.nature_remo ["access_token"];
        this.device_name             = this.light.nature_remo ["device_name"];
        break;
      default:
        this.log ("Error message (provisional)");
        this.indicate_li_sensor      = false;
    };
    this.lightSensorService          = new Service.LightSensor (this.name)
    this.service.push (this.lightSensorService);
  };

//---- CO2 Sensor --------------------------------------------------------------
  this.indicate_co2_sensor           = config ["indicate_co2_sensor"]              || false;
  if (this.indicate_co2_sensor) {
    this.co2_val                     = null;
    this.co2_detected                = null;
    this.co2_sensor                  = config.co2 ["sensor"];
    switch (this.co2_sensor) {
      case "mh_z19":
        this.mhz19_uart_path         = config.co2.mh_z19 ["uart_path"]             || "/dev/ttyS0";
        break;
      default:
        this.log ("Error message (provisional)");
        this.indicate_co2_sensor     = false;
    };
    this.co2_warning_level           = config.co2 ["warning_level"]                || 1500;
    this.CarbonDioxideSensorService  = new Service.CarbonDioxideSensor (this.name);
    this.service.push (this.CarbonDioxideSensorService);
  };

//---- CO Sensor ---------------------------------------------------------------
  this.indicate_co_sensor            = config ["indicate_co_sensor"]               || false;
  if (this.indicate_co_sensor) {
    this.co_val                      = null;
    this.co_detected                 = null;
    this.co_sensor                   = config.co ["sensor"];
    switch (this.co_sensor) {
      default:
        this.log ("Error message (provisional)");
        this.indicate_co_sensor      = false;
    };
    this.co_warning_level            = config.co ["warning_level"]                 || 9;
    this.CarbonMonoxideSensorService = new Service.CarbonMonoxideSensor (this.name);
    this.service.push (this.CarbonMonoxideSensorService);
  };
//---- Air Quality Sensor ------------------------------------------------------
  this.E_G_boundary                  = config ["pm_E_G_boundary"]                  || 10
  this.G_F_boundary                  = config ["pm_G_F_boundary"]                  || 15
  this.F_I_boundary                  = config ["pm_F_I_boundary"]                  || 25
  this.I_P_boundary                  = config ["pm_I_P_boundary"]                  || 35

//---- PM10 Sensor ---------------------------------------------------------------
  this.indicate_pm10_sensor          = config ["indicate_pm10_sensor"]             || false;
  if (this.indicate_pm10_sensor) {
    this.pm10_val                    = null;
    this.air_quality1                = null;
    this.pm10_sensor                 = config.pm10 ["sensor"];
    switch (this.pm10_sensor) {
      case "zh06":
        this.zh06_uart_path          = config.pm10.zh06 ["uart_path"]              || "/dev/ttyS0";
        break;
      default:
        this.log ("Error message (provisional)");
        this.indicate_pm10_sensor    = false;
    };
  };

//---- PM2.5 Sensor ---------------------------------------------------------------
    this.indicate_pm2_5_sensor       = config ["indicate_pm2_5_sensor"]            || false;
    if (this.indicate_pm2_5_sensor) {
      this.pm2_5_val                 = null;
      this.air_quality2              = null;
      this.pm2_5_sensor              = config.pm2_5 ["sensor"];
      switch (this.pm2_5_sensor) {
        case "zh06":
          this.zh06_uart_path       = config.pm2_5.zh06 ["uart_path"]             || "/dev/ttyS0";
          break;
        default:
          this.log ("Error message (provisional)");
          this.indicate_pm2_5_sensor = false;
      };
    };

    if (this.indicate_pm10_sensor   == true || this.indicate_pm2_5_sensor   == true) {
      this.AirQualitySensorService   = new Service.AirQualitySensor (this.name);
      this.service.push (this.AirQualitySensorService);
    };

//---- use_elasticsearch -------------------------------------------------------
  this.use_elasticsearch             = config ["use_elasticsearch"]                || false;
  if (this.use_elasticsearch) {
    this.host                        = config.elasticsearch_seting ["host"]        || 'localhost:9200';
    this.index                       = config.elasticsearch_seting ["index"]       || 'measured_value';
    this.title                       = config.elasticsearch_seting ["title"]       || 'measured_value';
    this.date_format                 = config.elasticsearch_seting ["date_format"] || 'YYYY-MM-DDTHH:mm:ss';
  }

  let job = cron.schedule (this.schedule, () => {
    this.getMeasuredValue ();
  });
}

//------------------------------------------------------------------------------
SensorAccessory.prototype.getServices = function () {
  return this.service;
}

//------------------------------------------------------------------------------
SensorAccessory.prototype.getMeasuredValue = function () {
  if (this.indicate_te_sensor) {
    switch (this.te_sensor) {
      case "nature_remo":
        this.getNatureRemoMeasuredValue ();
        break;
      case "switch_bot":
        this.getSwitchBotMeasuredValue ();
        break;
      default:
        this.log ("エラーメッセージテスト１");
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
        if (this.te_sensor != "switch_bot") {
          this.getSwitchBotMeasuredValue ();
        }
        break;
      default:
        this.log ("エラーメッセージテスト２");
    };
  };

  if (this.indicate_li_sensor) {
    switch (this.li_sensor) {
      case "nature_remo":
        if ((this.te_sensor != "nature_remo") && (this.hu_sensor != "nature_remo")) {
          this.getNatureRemoMeasuredValue ();
        }
        break;
      default:
        this.log ("エラーメッセージテスト３");
    };
  };

  if (this.indicate_co2_sensor) {
    switch (this.co2_sensor) {
      case "mh_z19":
        this.getMhz19MeasuredValue ();
        break;
      default:
        this.log ("エラーメッセージテスト４");
    };
  };

  if (this.indicate_co_sensor) {
    switch (this.co_sensor) {
      default:
        this.log ("エラーメッセージテスト５");
    };
  };

  if (this.indicate_pm10_sensor) {
    switch (this.pm10_sensor) {
      case "zh06":
        this.getZh06MeasuredValue ();
        break;
      default:
        this.log ("エラーメッセージテスト６");
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
        this.log ("エラーメッセージテスト７");
    };
  };

  if (this.use_elasticsearch) {
    this.setElasticsearch ();
  };
}

//---- NatureRemo Cloud Sensor -------------------------------------------------
SensorAccessory.prototype.getNatureRemoMeasuredValue = function () {
  new NatureRemo (this.access_token, this.device_name, function (error, value, stderr) {

    if (this.te_sensor == "nature_remo") {
      this.te_val = value.te
      if (this.te_val == null) {
        this.temperatureSensorService
          .updateCharacteristic (Characteristic.CurrentTemperature, new Error (error));
      }
      else {
        this.log(`<<<< [Update] Temperature: ${this.te_val}`);
        this.temperatureSensorService
          .updateCharacteristic (Characteristic.CurrentTemperature, this.te_val);
      };
    };

    if (this.hu_sensor == "nature_remo") {
      this.hu_val = value.hu
      if (this.hu_val == null) {
        this.humiditySensorService
          .updateCharacteristic (Characteristic.CurrentRelativeHumidity, new Error (error));
      }
      else {
        this.log(`<<<< [Update] Humidity: ${this.hu_val}`);
        this.humiditySensorService
          .updateCharacteristic (Characteristic.CurrentRelativeHumidity, this.hu_val);
      };
    };

    if (this.li_sensor == "nature_remo") {
      this.li_val = value.li
      if (this.li_val == null) {
        this.lightSensorService
          .updateCharacteristic (Characteristic.CurrentAmbientLightLevel, new Error (error));
      }
      else {
        this.log(`<<<< [Update] Light Level: ${this.li_val}`);
        this.lightSensorService
          .updateCharacteristic (Characteristic.CurrentAmbientLightLevel, this.li_val);
      };
    };
  }.bind (this));
}

//---- SwitchBot WoSensorTH ----------------------------------------------------
SensorAccessory.prototype.getSwitchBotMeasuredValue = function () {
//  new SwitchBot (this.ble_mac, function (error, value, stderr) {
//    if (this.te_sensor == ) {
//      this.te_val = value.te
//      if (this.te_val == null) {
//        this.temperatureSensorService
//          .updateCharacteristic (Characteristic.CurrentTemperature, new Error (error));
//      }
//      else {
//        this.log(`<<<< [Update] Temperature: ${this.te_val}`);
//        this.temperatureSensorService
//          .updateCharacteristic (Characteristic.CurrentTemperature, this.te_val);
//      };
//    };
//
//    if (this.hu_sensor == ) {
//      this.hu_val = value.hu
//      if (this.hu_val == null) {
//        this.humiditySensorService
//          .updateCharacteristic (Characteristic.CurrentRelativeHumidity, new Error (error));
//      }
//      else {
//        this.log(`<<<< [Update] Humidity: ${this.hu_val}`);
//        this.humiditySensorService
//          .updateCharacteristic (Characteristic.CurrentRelativeHumidity, this.hu_val);
//      };
//    };
//  }.bind (this));
}

//---- MH-Z19 ------------------------------------------------------------------
SensorAccessory.prototype.getMhz19MeasuredValue = function () {
  new MH_Z19 (this.mhz19_uart_path, function (error, value, stderr) {
    this.co2_val = value
    if (this.co2_val == null) {
      this.CarbonDioxideSensorService
        .updateCharacteristic (Characteristic.CarbonDioxideLevel, new Error (error));
      this.CarbonDioxideSensorService
        .updateCharacteristic (Characteristic.CarbonDioxideDetected, new Error (error));
    }
    else {
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

//---- ZH06 ------------------------------------------------------------------
SensorAccessory.prototype.getZh06MeasuredValue = function () {
  new ZH06 (this.zh06_uart_path, function (error, value, stderr) {

    if (this.pm10_sensor == "zh06") {
      this.pm10_val = value.pm10
      if (this.te_val == null) {
        this.AirQualitySensorService
          .updateCharacteristic (Characteristic.PM10Density, new Error (error));
      }
      else {
        this.air_quality1 = (this.pm10_E_G_boundary < this.pm10_val) ? 2 : 1;
        this.air_quality1 = (this.pm10_G_F_boundary < this.pm10_val) ? 3 : 1;
        this.air_quality1 = (this.pm10_F_I_boundary < this.pm10_val) ? 4 : 1;
        this.air_quality1 = (this.pm10_I_P_boundary < this.pm10_val) ? 5 : 1;
        this.log(`<<<< [Update] PM10 Density: ${this.pm10_val}`);
        this.AirQualitySensorService
          .updateCharacteristic (Characteristic.PM10Density, this.pm10_val);
      };
    };

    if (this.pm2_5_sensor == "zh06") {
      this.pm2_5_val = value.pm2_5
      if (this.te_val == null) {
        this.AirQualitySensorService
          .updateCharacteristic (Characteristic.PM2_5Density, new Error (error));
      }
      else {
        this.air_quality2 = (this.pm2_5_E_G_boundary < this.pm2_5_val) ? 2 : 1;
        this.air_quality2 = (this.pm2_5_G_F_boundary < this.pm2_5_val) ? 3 : 1;
        this.air_quality2 = (this.pm2_5_F_I_boundary < this.pm2_5_val) ? 4 : 1;
        this.air_quality2 = (this.pm2_5_I_P_boundary < this.pm2_5_val) ? 5 : 1;
        this.log(`<<<< [Update] PM2_5 Density: ${this.pm2_5_val}`);
        this.AirQualitySensorService
          .updateCharacteristic (Characteristic.PM2_5Density, this.pm2_5_val);
      };
    };

    if (this.indicate_pm10_sensor == true && this.indicate_pm2_5_sensor == true) {
      this.air_quality = Math.round ((this.air_quality1 + this.air_quality2) / 2)
      this.log(`<<<< [Update] Air Quality: ${this.air_quality}`);
      this.AirQualitySensorService
        .updateCharacteristic (Characteristic.AirQuality, this.air_quality);
    }
    else if (this.indicate_pm10_sensor == true) {
      this.log(`<<<< [Update] Air Quality: ${this.air_quality1}`);
      this.AirQualitySensorService
        .updateCharacteristic (Characteristic.AirQuality, this.air_quality1);
    }
    else if (this.indicate_pm2_5_sensor == true) {
      this.log(`<<<< [Update] Air Quality: ${this.air_quality2}`);
      this.AirQualitySensorService
        .updateCharacteristic (Characteristic.AirQuality, this.air_quality2);
    }

  }.bind (this));
}

//------------------------------------------------------------------------------
SensorAccessory.prototype.setElasticsearch = function () {
  let send_json = sendJsonCreate.main (this.index, this.title, this.date_format, this.indicate_te_sensor, this.te_val, this.indicate_hu_sensor, this.hu_val, this.indicate_li_sensor, this.li_val, this.indicate_co2_sensor, this.co2_val, this.indicate_co_sensor, this.co_val, this.indicate_pm10_sensor, this.pm10_val, this.indicate_pm2_5_sensor, this.pm2_5_val);
  let client    = new elasticsearch.Client ({ host: this.host });

  client.ping ({ requestTimeout: 2000 }, function (error) {
    if (error) {
      this.log (`* * * Elasticsearch cluster is down * * *`);
    }
    else {
      client.index (send_json, function (error) {
        if (error) {
          this.log (`* * * Elasticsearch Error * * *`);
        }
        else {
          this.log (`>>>> [Uplord] Elasticsearch: * * Document Input * *`);
        }
      }.bind (this));
    }
  }.bind (this));
}
