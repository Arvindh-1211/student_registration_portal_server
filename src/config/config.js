require('dotenv').config();

const getEnvVar = (name, defaultValue) => {
  const value = process.env[name];
  return value !== undefined ? value : defaultValue;
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
  JWT_SECRET: getEnvVar('JWT_SECRET', ''),
  CAMPS: campsConfig,
}

module.exports = configs;