const mysql = require('mysql2/promise');

const configs = require('../config/config');

const campsConfig = {
  host: configs.CAMPS.HOST,
  port: configs.CAMPS.PORT,
  user: configs.CAMPS.USER,
  password: configs.CAMPS.PASSWORD,
  database: configs.CAMPS.DB,
  connectionLimit: 20,
};

const camps = mysql.createPool(campsConfig);

module.exports = camps;