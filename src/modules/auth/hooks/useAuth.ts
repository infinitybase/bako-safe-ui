import { CookieName, CookiesConfig } from '@/config/cookies';
import { IPermissions } from '@/modules/core';

import { useAuthStore } from '../store';

type AuthenticateParams = {
  userId: string;
  avatar: string;
  account: string;
  accessToken: string;
  permissions: IPermissions;
  singleWorkspace: string;
};

type AuthenticateWorkspaceParams = {
  permissions: IPermissions;
  workspace: string;
};

const useAuth = () => {
  const store = useAuthStore();

  const userPermission = store.permissions?.[store.userId];

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
    ]);
    store.singleAuthentication({
      userId: params.userId,
      avatar: params.avatar,
      account: params.account,
      workspace: params.singleWorkspace,
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
    ]);
    store.logout();
  };

  return {
    handlers: {
      logout,
      authenticate,
      authenticateWorkspace,
      setInvalidAccount: store.setInvalidAccount,
      authenticateWorkspaceSingle,
    },
    isSingleWorkspace: store.workspaces.single === store.workspaces.single,
    userId: store.userId,
    account: store.account,
    workspaces: store.workspaces,
    permissions: store.permissions,
    isInvalidAccount: store.invalidAccount,
    userPermission,
    avatar: store.avatar,
  };
};

export { useAuth };
