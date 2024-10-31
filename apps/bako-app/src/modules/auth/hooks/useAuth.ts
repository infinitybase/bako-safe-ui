import {
  AuthenticateParams,
  IUseAuthDetails,
  UserType,
} from '@bako-safe/services/types';
import { useFuel } from '@fuels/react';
import { TypeUser } from 'bakosafe';
import { Provider } from 'fuels';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { queryClient } from '@/config';
import {
  EConnectors,
  EConnectorsInverse,
} from '@/modules/core/hooks/fuel/useListConnectors';

import {
  generateRedirectQueryParams,
  useAuthCookies,
  useQueryParams,
  useSignOut,
} from '..';
import { useUserInfoRequest } from './useUserInfoRequest';

export type SingleAuthentication = {
  workspace: string;
};

export type WorkspaceAuthentication = {
  workspace: string;
};

const useAuth = (): IUseAuthDetails => {
  const { infos, isLoading, isFetching, refetch } = useUserInfoRequest();
  const [invalidAccount, setInvalidAccount] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const { fuel } = useFuel();
  const { setAuthCookies, clearAuthCookies, userAuthCookiesInfo } =
    useAuthCookies();
  const signOutRequest = useSignOut();
  const { account, singleWorkspace, accessToken } = userAuthCookiesInfo();
  const { sessionId, origin, name, request_id, byConnector } = useQueryParams();
  const navigate = useNavigate();

  const authenticate = (params: AuthenticateParams) => {
    setAuthCookies(params);
  };

  const logout = async (removeTokenFromDb = true, callback?: () => void) => {
    if (accessToken && removeTokenFromDb) {
      await signOutRequest.mutateAsync();
      callback?.();
    }

    setTimeout(() => {
      clearAuthCookies();
      queryClient.clear();

      const queryParams = generateRedirectQueryParams({
        sessionId,
        origin,
        name,
        request_id,
        byConnector: byConnector ? String(byConnector) : undefined,
      });
      navigate(`/${queryParams}`);
    }, 200);
  };

  const logoutWhenExpired = async () => {
    clearAuthCookies();
    queryClient.clear();
    navigate('/?expired=true');
  };

  const userProvider = async () => {
    const _userProvider = infos?.type?.type != TypeUser.WEB_AUTHN;

    return {
      provider: await Provider.create(
        _userProvider
          ? (await fuel.currentNetwork()).url
          : 'http://localhost:4000/v1/graphql',
      ),
    };
  };

  const userType = (): UserType => {
    if (infos?.webauthn)
      return { type: TypeUser.WEB_AUTHN, name: EConnectors.WEB_AUTHN };

    const currentConnector = fuel.currentConnector()?.name as EConnectors;

    return {
      type: TypeUser[EConnectorsInverse[currentConnector]],
      name: currentConnector,
    };
  };

  return {
    handlers: {
      logout,
      logoutWhenExpired,
      authenticate,
      setInvalidAccount,
    },
    userProvider,
    invalidAccount,
    userInfos: {
      avatar: infos?.avatar,
      id: infos?.id,
      name: infos?.name,
      onSingleWorkspace: infos?.onSingleWorkspace ?? false,
      type: userType(),
      webauthn: infos?.webauthn,
      workspace: infos?.workspace,
      address: account,
      singleWorkspaceId: singleWorkspace,
      first_login: infos?.first_login,
      network: infos?.network,
      isLoading,
      isFetching,
      refetch,
    },
  };
};

export { useAuth };
