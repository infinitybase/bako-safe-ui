const getEnvironment = (): string => {
  let bakoEnv = 'preview';

  if (window.location.host.includes('stg-safe')) {
    bakoEnv = 'staging';
  } else if (window.location.host.includes('hmg-safe')) {
    bakoEnv = 'homologacao';
  } else if (window.location.host.includes('safe.bako.global')) {
    bakoEnv = 'production';
  }

  return bakoEnv;
};
export const getUIUrl = (): string => {
  const environment = getEnvironment();
  let baseUrl = '';

  switch (environment) {
    case 'staging':
      baseUrl = 'https://stg-safe.bako.global';
      break;
    case 'production':
      baseUrl = 'https://safe.bako.global';
      break;
    default:
      baseUrl = 'http://127.0.0.1:5174';
  }

  return baseUrl;
};

export const getBakoIDURL = (): string => {
  const environment = getEnvironment();
  let baseUrl = '';

  switch (environment) {
    case 'staging':
      baseUrl = 'https://preview.bako.id/';
      break;
    case 'production':
      baseUrl = 'https://app.bako.id/';
      break;
    default:
      baseUrl = 'http://127.0.0.1:5174';
  }

  return baseUrl;
};

export const GARAGE_APP_URL = 'https://garage.zone';

export const getGarageURL = (): string => {
  const environment = getEnvironment();
  let baseUrl = '';

  switch (environment) {
    case 'preview':
      baseUrl = 'https://preview.garage.zone/';
      break;
    case 'staging':
      baseUrl = 'https://preview.garage.zone/';
      break;
    case 'production':
      baseUrl = GARAGE_APP_URL;
      break;
    default:
      baseUrl = 'http://127.0.0.1:5174';
  }

  return baseUrl;
};

export { getEnvironment };
