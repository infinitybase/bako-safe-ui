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
    {
      name: CookieName.USER_ID,
      value: params.userId,
    },
    {
      name: CookieName.AVATAR,
      value: params.avatar!,
    },
    {
      name: CookieName.SINGLE_WORKSPACE,
      value: params.singleWorkspace,
    },
    {
      name: CookieName.WEB_AUTHN_PK,
      value: params.webAuthn?.publicKey ?? '',
    },
    {
      name: CookieName.WEB_AUTHN_ID,
      value: params.webAuthn?.id ?? '',
    },
    {
      name: CookieName.ACCOUNT_TYPE,
      value: params.accountType,
    },
  ]);
};

const clearAuthCookies = () => {
  CookiesConfig.removeCookies([CookieName.ADDRESS, CookieName.ACCESS_TOKEN]);
  return;
};

const userAuthCookiesInfo = () => {
  return {
    accessToken: CookiesConfig.getCookie(CookieName.ACCESS_TOKEN),
    account: CookiesConfig.getCookie(CookieName.ADDRESS),
    userId: CookiesConfig.getCookie(CookieName.USER_ID),
    avatar: CookiesConfig.getCookie(CookieName.AVATAR),
    singleWorkspace: CookiesConfig.getCookie(CookieName.SINGLE_WORKSPACE),
    webAuthn: {
      id: CookiesConfig.getCookie(CookieName.WEB_AUTHN_ID),
      publicKey: CookiesConfig.getCookie(CookieName.WEB_AUTHN_PK),
    },
    accountType: CookiesConfig.getCookie(CookieName.ACCOUNT_TYPE),
  };
};

export const useAuthCookies = () => {
  return {
    setAuthCookies,
    clearAuthCookies,
    userAuthCookiesInfo,
  };
};
