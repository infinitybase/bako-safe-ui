import { useSocket } from '@/modules/core';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useFuel, useIsConnected } from '@fuels/react';
import { Location, useNavigate } from 'react-router-dom';

import {
  EConnectors,
  useDefaultConnectors,
} from '@/modules/core/hooks/fuel/useListConnectors';
import { Pages } from '@/modules/core/routes';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { ENetworks } from '@/utils/constants';

import { TypeUser } from '../services';
import { useQueryParams } from './usePopup';
import { useCreateUserRequest, useSignInRequest } from './useUserRequest';
import { useWebAuthn } from './useWebAuthn';
import { useCreateFirstVault } from '@/modules/core/hooks/useCreateFirstVault';

export const redirectPathBuilder = (isDapp: boolean, location: Location) => {
  const isRedirectToPrevious = !!location.state?.from;

  if (isDapp && isRedirectToPrevious) {
    return location.state.from;
  }

  if (isDapp) {
    return `${Pages.dappAuth()}${location.search}`;
  }

  return Pages.home();
};

const useSignIn = () => {
  const navigate = useNavigate();
  const [workspaceId, setWorkspaceId] = useState('');
  const { handleCreateFirstVault } = useCreateFirstVault(workspaceId);

  const connectorDrawer = useDisclosure();
  const [isAnyWalletConnectorOpen, setIsAnyWalletConnectorOpen] =
    useState(false);

  const { fuel } = useFuel();
  const { authDetails, invalidateGifAnimationRequest } = useWorkspaceContext();
  const { isConnected } = useIsConnected();
  const { openConnect, location, sessionId, isOpenWebAuth } = useQueryParams();
  const { connect } = useSocket();

  useEffect(() => {
    if (isOpenWebAuth) {
      openWebAuthnDrawer();
    }
  }, []);

  const { connectors } = useDefaultConnectors();
  const { openWebAuthnDrawer, userName, ...rest } = useWebAuthn(
    invalidateGifAnimationRequest,
  );

  const hasFuel = !!fuel;

  useEffect(() => {
    connect(getSessionId());
  });

  const getSessionId = () => {
    const params = new URLSearchParams(location.search);
    let sessionId = params.get('sessionId');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      window.localStorage.setItem('sessionId', sessionId);
    }

    return sessionId;
  };

  const signInRequest = useSignInRequest({
    onSuccess: ({
      accessToken,
      avatar,
      user_id,
      workspace,
      webAuthn,
      address,
      first_login,
    }) => {
      const _webAuthn = webAuthn ? { ...webAuthn } : undefined;
      setWorkspaceId(workspace.id);

      authDetails.handlers.authenticate({
        userId: user_id,
        avatar: avatar!,
        account: address,
        accountType: TypeUser.FUEL,
        accessToken: accessToken,
        singleWorkspace: workspace.id,
        permissions: workspace.permissions,
        webAuthn: _webAuthn,
      });
      invalidateGifAnimationRequest();

      if (first_login) {
        handleCreateFirstVault(address, user_id, !!webAuthn, userName);
        return;
      }

      navigate(redirectPathBuilder(!!sessionId, location));
    },
  });

  const createUserRequest = useCreateUserRequest({
    onSuccess: ({ code, type }) => {
      signInRequest.mutate({
        code,
        type,
      });
    },
  });

  const redirectToWalletLink = () =>
    window.open(import.meta.env.VITE_FUEL_WALLET_URL, '_BLANK');

  const selectConnector = async (connector: string) => {
    const isWalletConnectorOpen = await fuel.selectConnector(connector);
    setIsAnyWalletConnectorOpen(isWalletConnectorOpen);

    connectorDrawer.onClose();
    const isbyWallet = connector !== EConnectors.WEB_AUTHN;
    if (isbyWallet) {
      return connectByWallet();
    }

    openWebAuthnDrawer();
  };

  const connectByWallet = async () => {
    try {
      const connected = await fuel.connect();

      if (!connected) return;

      const network = await fuel.currentNetwork();
      const account = await fuel.currentAccount();

      if (network.url === ENetworks.BETA_5) {
        throw Error;
      }

      createUserRequest.mutate({
        address: account!,
        provider: network!.url,
        type: account ? TypeUser.FUEL : TypeUser.WEB_AUTHN,
      });
      setIsAnyWalletConnectorOpen(false);
    } catch (e) {
      setIsAnyWalletConnectorOpen(false);
      authDetails.handlers.setInvalidAccount?.(true);
    }
  };

  useEffect(() => {
    const fueletConnectionStatus = () => (data: boolean) => {
      setIsAnyWalletConnectorOpen(data);
    };

    fuel.on(fuel.events.connection, fueletConnectionStatus());

    return () => {
      fuel.off(fuel.events.connection, fueletConnectionStatus);
    };
  }, [fuel]);

  return {
    auth: authDetails,
    connectByWallet,
    webauthn: {
      ...rest,
      openWebAuthnDrawer,
    },
    signInRequest,
    isConnected,
    isConnecting: signInRequest.isPending || createUserRequest.isPending,
    createUserRequest,
    connectors: {
      items: connectors,
      drawer: connectorDrawer,
      select: selectConnector,
      has: !!connectors?.length,
      isAnyWalletConnectorOpen,
    },
    hasFuel,
    redirectToWalletLink,
    byConnector: openConnect,
  };
};

export { useSignIn };
