import { CookieName, CookiesConfig } from '@/config/cookies';

const authCredentials = () => ({
  token: CookiesConfig.getCookie(CookieName.ACCESS_TOKEN),
  address: CookiesConfig.getCookie(CookieName.ADDRESS),
});

const authCredentialsByKey = (key: 'token' | 'address') => {
  const credentials = authCredentials();
  const hasCredential = key in credentials;

  if (!hasCredential) {
    throw new Error('Key not found in credentials');
  }

  return credentials[key];
};

export { authCredentials, authCredentialsByKey };
