import { useDisclosure } from '@chakra-ui/react';
import { useAccount, useFuel, useIsConnected } from '@fuels/react';
import { useEffect } from 'react';
import { Location, useNavigate } from 'react-router-dom';

import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useSocket } from '@/modules/core';
import {
  EConnectors,
  useDefaultConnectors,
} from '@/modules/core/hooks/fuel/useListConnectors';
import { Pages } from '@/modules/core/routes';
import { ENetworks } from '@/utils/constants';

import { TypeUser } from '../services';
import { useQueryParams } from './usePopup';
import { useCreateUserRequest, useSignInRequest } from './useUserRequest';
import { useWebAuthn } from './useWebAuthn';

export const redirectPathBuilder = (
  isDapp: boolean,
  location: Location,
  account: string,
) => {
  const isRedirectToPrevious = !!location.state?.from;
  console.log('[PARAMS]: ', {
    isDapp,
    location,
    account,
    isRedirectToPrevious,
  });
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
  const connectorDrawer = useDisclosure();

  const { fuel } = useFuel();
  const auth = useAuth();
  const { isConnected } = useIsConnected();
  const { openConnect, location, sessionId, isOpenWebAuth } = useQueryParams();
  const { account } = useAccount();

  const { connect } = useSocket();

  useEffect(() => {
    if (isOpenWebAuth) {
      openWebAuthnDrawer();
    }
  }, []);

  const { connectors } = useDefaultConnectors();
  const { openWebAuthnDrawer, ...rest } = useWebAuthn();

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
    onSuccess: ({ accessToken, avatar, user_id, workspace, webAuthn }) => {
      const _webAuthn = webAuthn ? { ...webAuthn } : undefined;
      auth.handlers.authenticate({
        userId: user_id,
        avatar: avatar!,
        account: account!,
        accountType: TypeUser.FUEL,
        accessToken: accessToken,
        singleWorkspace: workspace.id,
        permissions: workspace.permissions,
        webAuthn: _webAuthn,
      });

      navigate(redirectPathBuilder(!!sessionId, location, account!));
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
    await fuel.selectConnector(connector);
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
        console.log('Try to connect to your local network');
        throw Error;
      }

      createUserRequest.mutate({
        address: account!,
        provider: network!.url,
        type: account ? TypeUser.FUEL : TypeUser.WEB_AUTHN,
      });
    } catch (e) {
      auth.handlers.setInvalidAccount(true);
    }
  };

  return {
    auth,
    connectByWallet,
    webauthn: {
      ...rest,
      openWebAuthnDrawer,
    },
    signInRequest,
    isConnected,
    isConnecting: signInRequest.isLoading || createUserRequest.isLoading,
    createUserRequest,
    connectors: {
      items: connectors,
      drawer: connectorDrawer,
      select: selectConnector,
      has: !!connectors?.length,
    },
    hasFuel,
    redirectToWalletLink,
    byConnector: openConnect,
  };
};

export { useSignIn };
