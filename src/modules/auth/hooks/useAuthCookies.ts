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
  CookiesConfig.removeCookies([
    CookieName.ADDRESS,
    CookieName.AVATAR,
    CookieName.USER_ID,
    CookieName.ACCESS_TOKEN,
    CookieName.SINGLE_WORKSPACE,
    CookieName.WEB_AUTHN_ID,
    CookieName.WEB_AUTHN_PK,
    CookieName.ACCOUNT_TYPE,
  ]);
  return;
};

export const useAuthCookies = () => {
  return {
    setAuthCookies,
    clearAuthCookies,
  };
};
