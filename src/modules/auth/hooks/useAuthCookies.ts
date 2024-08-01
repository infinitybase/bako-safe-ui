import { CookiesConfig, CookieName } from '@/config/cookies';
import { AuthenticateParams } from '../services';

const setAuthCookies = (params: AuthenticateParams) => {
  CookiesConfig.setCookies([
    {
      name: CookieName.ACCESS_TOKEN,
      value: params.accessToken,
    },
    {
      name: CookieName.ADDRESS,
      value: params.account,
    },
  ]);
};

const clearAuthCookies = () => {
  CookiesConfig.removeCookies([CookieName.ADDRESS, CookieName.ACCESS_TOKEN]);
  return;
};

export const useAuthCookies = () => {
  return {
    setAuthCookies,
    clearAuthCookies,
  };
};
