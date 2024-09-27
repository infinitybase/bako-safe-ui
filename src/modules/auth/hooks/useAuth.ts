import { useFuel } from '@fuels/react';
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
import { AuthenticateParams, IUseAuthReturn, TypeUser } from '../services';
import { useUserInfoRequest } from './useUserInfoRequest';

export type SingleAuthentication = {
  workspace: string;
};

export type WorkspaceAuthentication = {
  workspace: string;
};

const useAuth = (): IUseAuthReturn => {
  const { infos, isLoading, isFetching, refetch } = useUserInfoRequest();
  const [invalidAccount, setInvalidAccount] = useState(false);
  const { fuel } = useFuel();
  const { setAuthCookies, clearAuthCookies, userAuthCookiesInfo } =
    useAuthCookies();
  const signOutRequest = useSignOut();
  const { account, singleWorkspace, accessToken } = userAuthCookiesInfo();
  const { sessionId, origin, name, request_id } = useQueryParams();
  const navigate = useNavigate();

  const authenticate = (params: AuthenticateParams) => {
    setAuthCookies(params);
  };

  const logout = (removeTokenFromDb = true) => {
    if (accessToken && removeTokenFromDb) {
      signOutRequest.mutate();
    }

    setTimeout(() => {
      clearAuthCookies();
      queryClient.clear();

      const queryParams = generateRedirectQueryParams({
        sessionId,
        origin,
        name,
        request_id,
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
    const _userProvider = infos?.type != TypeUser.WEB_AUTHN;

    return {
      provider: await Provider.create(
        _userProvider
          ? (await fuel.currentNetwork()).url
          : 'http://localhost:4000/v1/graphql',
      ),
    };
  };

  const userType = (): TypeUser => {
    if (infos?.webauthn) return TypeUser.WEB_AUTHN;

    const currentConnector = fuel.currentConnector()?.name as EConnectors;

    return TypeUser[EConnectorsInverse[currentConnector]];
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
      avatar: infos?.avatar!,
      id: infos?.id!,
      name: infos?.name!,
      onSingleWorkspace: infos?.onSingleWorkspace ?? false,
      type: userType(),
      webauthn: infos?.webauthn!,
      workspace: infos?.workspace!,
      address: account,
      singleWorkspaceId: singleWorkspace,
      first_login: infos?.first_login,
      isLoading,
      isFetching,
      refetch,
    },
  };
};

export { useAuth };
