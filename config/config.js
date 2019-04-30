const path = require("path");

const env = process.env.NODE_ENV || "development";

const baseConfig = {
  wxHeadUrl: "http://wx.qlogo.cn/"
};

const CONFIG = {
  production: {},
  development: {}
};

const config = Object.assign(baseConfig, CONFIG[env], {
  env,
  path_base: path.resolve(__dirname, "..")
});

config.globals = {
  NODE_ENV: config.env,
  __DEV__: config.env === "development"
};

module.exports = config;
