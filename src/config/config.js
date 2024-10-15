require('dotenv').config();

const getEnvVar = (name, defaultValue) => {
  const value = process.env[name];
  return value !== undefined ? value : defaultValue;
};

const dbConfig = {
  HOST: getEnvVar('DB_HOST', ''),
  DB: getEnvVar('DB_DB', ''),
  PORT: getEnvVar('DB_PORT', ''),
  USER: getEnvVar('DB_USER', ''),
  PASSWORD: getEnvVar('DB_PASSWORD', ''),
};

const campsConfig = {
  HOST: getEnvVar('CAMPS_HOST', ''),
  DB: getEnvVar('CAMPS_DB', ''),
  PORT: getEnvVar('CAMPS_PORT', ''),
  USER: getEnvVar('CAMPS_USER', ''),
  PASSWORD: getEnvVar('CAMPS_PASSWORD', ''),
};

const configs = {
  PORT: getEnvVar('PORT', 8000),
  DB: dbConfig,
  CAMPS: campsConfig,
}

module.exports = configs;