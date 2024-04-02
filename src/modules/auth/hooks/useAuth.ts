import { useFuel } from '@fuels/react';
import { defaultConfig } from 'bakosafe';
import { Provider } from 'fuels';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { IPermission } from '@/modules/core';

import { SignWebAuthnPayload, TypeUser } from '../services';
import { useAuthStore } from '../store';

type AuthenticateParams = {
  userId: string;
  avatar: string;
  account: string;
  accountType: TypeUser;
  accessToken: string;
  permissions: IPermission;
  singleWorkspace: string;
  webAuthn?: Omit<SignWebAuthnPayload, 'challenge'>;
};

type AuthenticateWorkspaceParams = {
  permissions: IPermission;
  workspace: string;
};

const useAuth = () => {
  const store = useAuthStore();
  const { fuel } = useFuel();

  const authenticate = (params: AuthenticateParams) => {
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
    store.singleAuthentication({
      userId: params.userId,
      avatar: params.avatar,
      account: params.account,
      accountType: params.accountType,
      workspace: params.singleWorkspace,
      webAuthn: params.webAuthn,
    });
  };

  const authenticateWorkspace = (params: AuthenticateWorkspaceParams) => {
    store.workspaceAuthentication({
      permissions: params.permissions,
      workspace: params.workspace,
    });
  };

  const authenticateWorkspaceSingle = () => {
    store.workspaceAuthenticationSingle();
  };

  const logout = () => {
    CookiesConfig.removeCookies([
      CookieName.ADDRESS,
      CookieName.AVATAR,
      CookieName.USER_ID,
      CookieName.ACCESS_TOKEN,
      CookieName.SINGLE_WORKSPACE,
      CookieName.WEB_AUTHN_ID,
      CookieName.WEB_AUTHN_PK,
    ]);
    store.logout();
  };

  const hasWallet = async () => {
    const _hasWallet = store.accountType != TypeUser.WEB_AUTHN;

    return {
      provider: await Provider.create(
        _hasWallet
          ? (await fuel.currentNetwork()).url
          : defaultConfig['PROVIDER']!,
      ),
    };
  };

  return {
    handlers: {
      logout,
      authenticate,
      authenticateWorkspace,
      setInvalidAccount: store.setInvalidAccount,
      authenticateWorkspaceSingle,
    },
    hasWallet,
    accountType: store.accountType,
    avatar: store.avatar,
    userId: store.userId,
    account: store.account,
    webAuthn: {
      id: CookiesConfig.getCookie(CookieName.WEB_AUTHN_ID)!,
      publicKey: CookiesConfig.getCookie(CookieName.WEB_AUTHN_PK)!,
    },
    workspaces: store.workspaces,
    permissions: store.permissions,
    isInvalidAccount: store.invalidAccount,
    isSingleWorkspace: store.workspaces.current === store.workspaces.single,
  };
};

export { useAuth };
