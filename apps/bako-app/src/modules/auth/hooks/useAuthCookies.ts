import { AuthenticateParams } from '@bako-safe/services/types';

import { CookieName, CookiesConfig } from '@/config/cookies';

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
    {
      name: CookieName.SINGLE_WORKSPACE,
      value: params.singleWorkspace,
    },
  ]);
};

const clearAuthCookies = () => {
  CookiesConfig.removeCookies([
    CookieName.ADDRESS,
    CookieName.ACCESS_TOKEN,
    CookieName.SINGLE_WORKSPACE,
  ]);
  return;
};

const userAuthCookiesInfo = () => {
  return {
    accessToken: CookiesConfig.getCookie(CookieName.ACCESS_TOKEN),
    account: CookiesConfig.getCookie(CookieName.ADDRESS),
    singleWorkspace: CookiesConfig.getCookie(CookieName.SINGLE_WORKSPACE),
  };
};

export const useAuthCookies = () => {
  return {
    setAuthCookies,
    clearAuthCookies,
    userAuthCookiesInfo,
  };
};
