export const getEnviroment = (): string => {
  let bakoEnv = 'preview';
  if (window.location.host.indexOf('stg-safe') >= 0) {
    bakoEnv = 'staging';
  } else if (window.location.host.indexOf('hmg-safe') >= 0) {
    bakoEnv = 'homologacao';
  } else if (window.location.host.indexOf('safe.bako.global') >= 0) {
    bakoEnv = 'production';
  }

  return bakoEnv;
};
