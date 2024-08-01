import { useFuel } from '@fuels/react';
import { BakoSafe } from 'bakosafe';
import { Provider } from 'fuels';

import { CookieName, CookiesConfig } from '@/config/cookies';

import {
  AuthenticateParams,
  AuthenticateWorkspaceParams,
  IUseAuthReturn,
  TypeUser,
} from '../services';
//import { useTokensUSDAmountRequest } from '@/modules/home/hooks/useTokensUSDAmountRequest';
import { IUseAuthActions, useAuthCookies } from '..';

const useAuth = (authContext: IUseAuthActions): IUseAuthReturn => {
  const { fuel } = useFuel();
  const { setAuthCookies, clearAuthCookies } = useAuthCookies();
  //useTokensUSDAmountRequest(); -> MOVE

  const authenticate = (params: AuthenticateParams) => {
    setAuthCookies(params);
    authContext?.singleAuthentication({
      ...params,
      workspace: params.singleWorkspace,
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
    clearAuthCookies();
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
