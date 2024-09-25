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

const campsDevConfig = {
  HOST: getEnvVar('CAMPS_DEV_HOST', ''),
  DB: getEnvVar('CAMPS_DEV_DB', ''),
  PORT: getEnvVar('CAMPS_DEV_PORT', ''),
  USER: getEnvVar('CAMPS_DEV_USER', ''),
  PASSWORD: getEnvVar('CAMPS_DEV_PASSWORD', ''),
};

const campsDbConfig = {
  HOST: getEnvVar('CAMPS_DB_HOST', ''),
  DB: getEnvVar('CAMPS_DB_DB', ''),
  PORT: getEnvVar('CAMPS_DB_PORT', ''),
  USER: getEnvVar('CAMPS_DB_USER', ''),
  PASSWORD: getEnvVar('CAMPS_DB_PASSWORD', ''),
};

const configs = {
  PORT: getEnvVar('PORT', 8000),
  DB: dbConfig,
  CAMPS_DEV: campsDevConfig,
  CAMPS_DB: campsDbConfig,
}

module.exports = configs;