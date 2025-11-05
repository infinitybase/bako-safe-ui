/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useFuel } from '@fuels/react';
import { Provider } from 'fuels';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BAKO_SUPPORT_SEARCH } from '@/components/floatingCard';
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
import {
  AuthenticateParams,
  IUseAuthReturn,
  TypeUser,
  UserType,
} from '../services';
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
  const { sessionId, origin, name, request_id, byConnector, connectorType } =
    useQueryParams();
  const navigate = useNavigate();

  const authenticate = (params: AuthenticateParams) => {
    localStorage.setItem(BAKO_SUPPORT_SEARCH, 'true');
    window.dispatchEvent(new Event('bako-storage-change'));
    setAuthCookies(params);
  };

  const logout = async (removeTokenFromDb = true, callback?: () => void) => {
    localStorage.setItem(BAKO_SUPPORT_SEARCH, 'false');
    window.dispatchEvent(new Event('bako-storage-change'));
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
        connectorType: connectorType ? connectorType : undefined,
      });
      navigate(`/${queryParams}`);
    }, 200);
  };

  const logoutWhenExpired = async () => {
    localStorage.setItem(BAKO_SUPPORT_SEARCH, 'false');
    window.dispatchEvent(new Event('bako-storage-change'));
    clearAuthCookies();
    queryClient.clear();
    navigate('/?expired=true');
  };

  const userProvider = async () => {
    const _userProvider =
      infos?.type?.type === TypeUser.FUEL ||
      infos?.type?.type === TypeUser.FULLET;

    return {
      provider: new Provider(
        _userProvider
          ? (await fuel.currentNetwork()).url
          : 'http://localhost:4000/v1/graphql',
      ),
    };
  };

  const userType = (): UserType => {
    if (infos?.webauthn) {
      return { type: TypeUser.WEB_AUTHN, name: EConnectors.WEB_AUTHN };
    }

    const isEvm = (infos?.type as unknown as TypeUser) == TypeUser.EVM;
    if (isEvm) {
      return { type: TypeUser.EVM, name: EConnectors.EVM };
    }

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
      avatar: infos?.avatar!,
      id: infos?.id!,
      name: infos?.name!,
      onSingleWorkspace: infos?.onSingleWorkspace ?? false,
      settings: infos?.settings!,
      type: userType(),
      webauthn: infos?.webauthn!,
      workspace: infos?.workspace!,
      address: account,
      singleWorkspaceId: singleWorkspace,
      first_login: infos?.first_login,
      network: infos?.network!,
      isLoading,
      isFetching,
      refetch,
    },
  };
};

export { useAuth };
