import { useFuel } from '@fuels/react';
import { BakoSafe } from 'bakosafe';
import { Provider } from 'fuels';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { IPermission } from '@/modules/core';

import { SignWebAuthnPayload, TypeUser } from '../services';
import { useTokensUSDAmountRequest } from '@/modules/home/hooks/useTokensUSDAmountRequest';
import {
  IUseAuthActions,
  IUseAuthActionsState,
  IUseAuthActionHandler,
} from '..';

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

export type IUseAuthReturn = Omit<IUseAuthActionsState, 'formattedAccount'> & {
  account: string;
  hasWallet: () => Promise<{
    provider: Provider;
  }>;
  handlers: Partial<IUseAuthActionHandler> & {
    authenticate: (params: AuthenticateParams) => void;
    authenticateWorkspace: (params: AuthenticateWorkspaceParams) => void;
    authenticateWorkspaceSingle: () => void;
  };
  isSingleWorkspace: boolean;
};

const useAuth = (authContext: IUseAuthActions): IUseAuthReturn => {
  const { fuel } = useFuel();
  useTokensUSDAmountRequest();

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
    authContext?.singleAuthentication({
      userId: params.userId,
      avatar: params.avatar,
      account: params.account,
      accountType: params.accountType,
      workspace: params.singleWorkspace,
      webAuthn: params.webAuthn,
    });
  };

  const authenticateWorkspace = (params: AuthenticateWorkspaceParams) => {
    authContext?.workspaceAuthentication({
      permissions: params.permissions,
      workspace: params.workspace,
    });
  };

  const authenticateWorkspaceSingle = () => {
    authContext?.workspaceAuthenticationSingle();
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
      CookieName.ACCOUNT_TYPE,
    ]);
    authContext?.logout();
  };

  const hasWallet = async () => {
    const _hasWallet = authContext?.accountType != TypeUser.WEB_AUTHN;

    return {
      provider: await Provider.create(
        _hasWallet
          ? (await fuel.currentNetwork()).url
          : BakoSafe.getProviders('CHAIN_URL'),
      ),
    };
  };

  return {
    handlers: {
      logout,
      authenticate,
      authenticateWorkspace,
      setInvalidAccount: authContext?.setInvalidAccount,
      authenticateWorkspaceSingle,
    },
    hasWallet,
    accountType: authContext?.accountType,
    avatar: authContext?.avatar,
    userId: authContext?.userId,
    account: authContext?.account,
    webAuthn: {
      id: CookiesConfig.getCookie(CookieName.WEB_AUTHN_ID)!,
      publicKey: CookiesConfig.getCookie(CookieName.WEB_AUTHN_PK)!,
    },
    workspaces: authContext?.workspaces,
    permissions: authContext?.permissions,
    isInvalidAccount: authContext?.isInvalidAccount,
    isSingleWorkspace:
      authContext?.workspaces.current === authContext?.workspaces.single,
  };
};

export { useAuth };
