import { TypeUser } from '../services';
import { CookieName, CookiesConfig } from '@/config/cookies';
import { AddressUtils } from '@/modules/core';

const useUserInfo = () => {
  return {
    userInfos: {
      account: CookiesConfig.getCookie(CookieName.ADDRESS)!,
      accountType: CookiesConfig.getCookie(
        CookieName.ACCOUNT_TYPE,
      )! as TypeUser,
      userId: CookiesConfig.getCookie(CookieName.USER_ID)!,
      webAuthn: {
        id: CookiesConfig.getCookie(CookieName.WEB_AUTHN_ID)!,
        publicKey: CookiesConfig.getCookie(CookieName.WEB_AUTHN_PK)!,
      },
      workspaces: {
        single: CookiesConfig.getCookie(CookieName.SINGLE_WORKSPACE)!,
        current: CookiesConfig.getCookie(CookieName.SINGLE_WORKSPACE)!,
      },
      formattedAccount: AddressUtils.format(
        CookiesConfig.getCookie(CookieName.ADDRESS)!,
      )!,
      avatar: CookiesConfig.getCookie(CookieName.AVATAR)!,
    },
  };
};

export { useUserInfo };
