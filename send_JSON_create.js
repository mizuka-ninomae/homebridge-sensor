const moment        = require ('moment');

class SendJsonCreate {
  constructor () {}
  
  main (index, title, date_format, indicate_te_sensor, te_val, indicate_hu_sensor, hu_val, indicate_li_sensor, li_val, indicate_co2_sensor, co2_val, indicate_co_sensor, co_val, indicate_pm10_sensor, pm10_val, indicate_pm2_5_sensor, pm2_5_val) {
    this.index                 = index;
    this.title                 = title;
    this.date_format           = date_format;
    this.indicate_te_sensor    = indicate_te_sensor;
    this.te_val                = te_val;
    this.indicate_hu_sensor    = indicate_hu_sensor;
    this.hu_val                = hu_val;
    this.indicate_li_sensor    = indicate_li_sensor;
    this.li_val                = li_val;
    this.indicate_co2_sensor   = indicate_co2_sensor;
    this.co2_val               = co2_val;
    this.indicate_co_sensor    = indicate_co_sensor;
    this.co_val                = co_val;
    this.indicate_pm10_sensor  = indicate_pm10_sensor;
    this.pm10_val              = pm10_val;
    this.indicate_pm2_5_sensor = indicate_pm2_5_sensor;
    this.pm2_5_val             = pm2_5_val;

    let date = moment ().format (this.date_format);
    let body = {};
    if (this.indicate_te_sensor) {
      if (this.indicate_hu_sensor) {
        if (this.indicate_li_sensor) {
          if (this.indicate_co2_sensor) {
            if (this.indicate_co_sensor) {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "li": this.li_val, "co2": this.co2_val, "co": this.co_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "li": this.li_val, "co2": this.co2_val, "co": this.co_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "li": this.li_val, "co2": this.co2_val, "co": this.co_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "li": this.li_val, "co2": this.co2_val, "co": this.co_val, "date": date }
                }
              }
            } else {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "li": this.li_val, "co2": this.co2_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "li": this.li_val, "co2": this.co2_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "li": this.li_val, "co2": this.co2_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "li": this.li_val, "co2": this.co2_val, "date": date }
                }
              }
            }
          } else {
            if (this.indicate_co_sensor) {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "li": this.li_val, "co": this.co_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "li": this.li_val, "co": this.co_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "li": this.li_val, "co": this.co_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "li": this.li_val, "co": this.co_val, "date": date }
                }
              }
            } else {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "li": this.li_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "li": this.li_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "li": this.li_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "li": this.li_val, "date": date }
                }
              }
            }
          }
        } else {
          if (this.indicate_co2_sensor) {
            if (this.indicate_co_sensor) {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "co2": this.co2_val, "co": this.co_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "co2": this.co2_val, "co": this.co_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "co2": this.co2_val, "co": this.co_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "co2": this.co2_val, "co": this.co_val, "date": date }
                }
              }
            } else {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "co2": this.co2_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "co2": this.co2_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "co2": this.co2_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "co2": this.co2_val, "date": date }
                }
              }
            }
          } else {
            if (this.indicate_co_sensor) {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "co": this.co_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "co": this.co_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "co": this.co_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "co": this.co_val,  "date": date }
                }
              }
            } else {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "hu": this.hu_val, "date": date }
                }
              }
            }
          }
        }
      } else {
        if (this.indicate_li_sensor) {
          if (this.indicate_co2_sensor) {
            if (this.indicate_co_sensor) {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "li": this.li_val, "co2": this.co2_val, "co": this.co_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "li": this.li_val, "co2": this.co2_val, "co": this.co_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "li": this.li_val, "co2": this.co2_val, "co": this.co_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "li": this.li_val, "co2": this.co2_val, "co": this.co_val, "date": date }
                }
              }
            } else {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "li": this.li_val, "co2": this.co2_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "li": this.li_val, "co2": this.co2_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "li": this.li_val, "co2": this.co2_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "li": this.li_val, "co2": this.co2_val, "date": date }
                }
              }
            }
          } else {
            if (this.indicate_co_sensor) {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "li": this.li_val, "co": this.co_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "li": this.li_val, "co": this.co_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "li": this.li_val, "co": this.co_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "li": this.li_val, "co": this.co_val, "date": date }
                }
              }
            } else {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "li": this.li_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "li": this.li_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "li": this.li_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "li": this.li_val, "date": date }
                }
              }
            }
          }
        } else {
          if (this.indicate_co2_sensor) {
            if (this.indicate_co_sensor) {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "co2": this.co2_val, "co": this.co_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "co2": this.co2_val, "co": this.co_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "co2": this.co2_val, "co": this.co_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "co2": this.co2_val, "co": this.co_val, "date": date }
                }
              }
            } else {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "co2": this.co2_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "co2": this.co2_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "co2": this.co2_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "co2": this.co2_val, "date": date }
                }
              }
            }
          } else {
            if (this.indicate_co_sensor) {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "co": this.co_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "co": this.co_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "co": this.co_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "co": this.co_val, "date": date }
                }
              }
            } else {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "te": this.te_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "te": this.te_val, "date": date }
                }
              }
            }
          }
        }
      }
    } else {
      if (this.indicate_hu_sensor) {
        if (this.indicate_li_sensor) {
          if (this.indicate_co2_sensor) {
            if (this.indicate_co_sensor) {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "hu": this.hu_val, "li": this.li_val, "co2": this.co2_val, "co": this.co_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "hu": this.hu_val, "li": this.li_val, "co2": this.co2_val, "co": this.co_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "hu": this.hu_val, "li": this.li_val, "co2": this.co2_val, "co": this.co_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "hu": this.hu_val, "li": this.li_val, "co2": this.co2_val, "co": this.co_val, "date": date }
                }
              }
            } else {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "hu": this.hu_val, "li": this.li_val, "co2": this.co2_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "hu": this.hu_val, "li": this.li_val, "co2": this.co2_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "hu": this.hu_val, "li": this.li_val, "co2": this.co2_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "hu": this.hu_val, "li": this.li_val, "co2": this.co2_val, "date": date }
                }
              }
            }
          } else {
            if (this.indicate_co_sensor) {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "hu": this.hu_val, "li": this.li_val, "co": this.co_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "hu": this.hu_val, "li": this.li_val, "co": this.co_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "hu": this.hu_val, "li": this.li_val, "co": this.co_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "hu": this.hu_val, "li": this.li_val, "co": this.co_val, "date": date }
                }
              }
            } else {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "hu": this.hu_val, "li": this.li_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "hu": this.hu_val, "li": this.li_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "hu": this.hu_val, "li": this.li_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "hu": this.hu_val, "li": this.li_val, "date": date }
                }
              }
            }
          }
        } else {
          if (this.indicate_co2_sensor) {
            if (this.indicate_co_sensor) {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "hu": this.hu_val, "co2": this.co2_val, "co": this.co_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "hu": this.hu_val, "co2": this.co2_val, "co": this.co_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "hu": this.hu_val, "co2": this.co2_val, "co": this.co_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "hu": this.hu_val, "co2": this.co2_val, "co": this.co_val, "date": date }
                }
              }
            } else {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "hu": this.hu_val, "co2": this.co2_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "hu": this.hu_val, "co2": this.co2_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "hu": this.hu_val, "co2": this.co2_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "hu": this.hu_val, "co2": this.co2_val, "date": date }
                }
              }
            }
          } else {
            if (this.indicate_co_sensor) {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "hu": this.hu_val, "co": this.co_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "hu": this.hu_val, "co": this.co_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "hu": this.hu_val, "co": this.co_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "hu": this.hu_val, "co": this.co_val, "date": date }
                }
              }
            } else {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "hu": this.hu_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "hu": this.hu_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "hu": this.hu_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "hu": this.hu_val, "date": date }
                }
              }
            }
          }
        }
      } else {
        if (this.indicate_li_sensor) {
          if (this.indicate_co2_sensor) {
            if (this.indicate_co_sensor) {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "li": this.li_val, "co2": this.co2_val, "co": this.co_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "li": this.li_val, "co2": this.co2_val, "co": this.co_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "li": this.li_val, "co2": this.co2_val, "co": this.co_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "li": this.li_val, "co2": this.co2_val, "co": this.co_val, "date": date }
                }
              }
            } else {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "li": this.li_val, "co2": this.co2_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "li": this.li_val, "co2": this.co2_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "li": this.li_val, "co2": this.co2_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "li": this.li_val, "co2": this.co2_val, "date": date }
                }
              }
            }
          } else {
            if (this.indicate_co_sensor) {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "li": this.li_val, "co": this.co_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "li": this.li_val, "co": this.co_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "li": this.li_val, "co": this.co_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "li": this.li_val, "co": this.co_val, "date": date }
                }
              }
            } else {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "li": this.li_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "li": this.li_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "li": this.li_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "li": this.li_val, "date": date }
                }
              }
            }
          }
        } else {
          if (this.indicate_co2_sensor) {
            if (this.indicate_co_sensor) {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "co2": this.co2_val, "co": this.co_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "co2": this.co2_val, "co": this.co_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "co2": this.co2_val, "co": this.co_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "co2": this.co2_val, "co": this.co_val, "date": date }
                }
              }
            } else {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "co2": this.co2_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "co2": this.co2_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "co2": this.co2_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "co2": this.co2_val, "date": date }
                }
              }
            }
          } else {
            if (this.indicate_co_sensor) {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "co": this.co_val, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "co": this.co_val, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "co": this.co_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "co": this.co_val, "date": date }
                }
              }
            } else {
              if (this.indicate_pm10_sensor) {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "pm10": this.pm10_val, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  body = { "title": this.title, "pm10": this.pm10_val, "date": date }
                }
              } else {
                if (this.indicate_pm2_5_sensor) {
                  body = { "title": this.title, "pm2_5": this.pm2_5_val, "date": date }
                } else {
                  return null;
                }
              }
            }
          }
        }
      }
    }

    return {
      index: this.index,
      refresh: true,
      body: body
    }
  }
}

module.exports = new SendJsonCreate ();
