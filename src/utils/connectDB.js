const mysql = require('mysql2/promise');

const configs = require('../config/config');

const db = mysql.createPool({
  host: configs.DB.HOST,
  port: configs.DB.PORT,
  user: configs.DB.USER,
  password: configs.DB.PASSWORD,
  database: configs.DB.DB,
  // Optional - Set the maximum number of connections in the pool
  connectionLimit: 20,
});

module.exports = db;