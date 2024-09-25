const mysql = require('mysql2/promise');

const configs = require('../config/config');

const campsConfig = {
  host: configs.CAMPS_DB.HOST,
  port: configs.CAMPS_DB.PORT,
  user: configs.CAMPS_DB.USER,
  password: configs.CAMPS_DB.PASSWORD,
  database: configs.CAMPS_DB.DB,
  // Optional: Set the maximum number of connections in the pool
  // connectionLimit: 10, 
};

const campsDevConfig = {
  host: configs.CAMPS_DEV.HOST,
  port: configs.CAMPS_DEV.PORT,
  user: configs.CAMPS_DEV.USER,
  password: configs.CAMPS_DEV.PASSWORD,
  database: configs.CAMPS_DEV.DB,
  // Optional: Set the maximum number of connections in the pool
  // connectionLimit: 10, 
};

const camps = mysql.createPool(campsDevConfig);

camps.on('enqueue', () => {
  console.log('Waiting for available connection slot in CAMPS');
});

camps.on('error', (err) => {
  console.error('Error occurred while connecting to CAMPS:', err);
});

module.exports = camps;