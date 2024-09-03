import { useFuel, useIsConnected } from '@fuels/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  EConnectors,
  useDefaultConnectors,
} from '@/modules/core/hooks/fuel/useListConnectors';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { ENetworks } from '@/utils/constants';

import { TypeUser } from '../../services';
import { useQueryParams } from '../usePopup';
import { useCreateUserRequest, useSignInRequest } from '../useUserRequest';
import { useWebAuthn } from '../useWebAuthn';
import { SignInOrigin, useSignInOriginFactory } from './origin';

const useSignIn = () => {
  const navigate = useNavigate();
  const [isAnyWalletConnectorOpen, setIsAnyWalletConnectorOpen] =
    useState(false);

  const { fuel } = useFuel();
  const { authDetails, invalidateGifAnimationRequest } = useWorkspaceContext();
  const { isConnected } = useIsConnected();
  const { sessionId, isOpenWebAuth } = useQueryParams();

  const signInOrigin = sessionId ? SignInOrigin.DAPP : SignInOrigin.WEB;
  const { redirect } = useSignInOriginFactory(signInOrigin);

  useEffect(() => {
    if (isOpenWebAuth) {
      openWebAuthnDrawer();
    }
  }, []);

  const { connectors } = useDefaultConnectors();
  const { openWebAuthnDrawer, ...rest } = useWebAuthn(
    invalidateGifAnimationRequest,
  );

  const signInRequest = useSignInRequest({
    onSuccess: ({
      accessToken,
      avatar,
      user_id,
      workspace,
      webAuthn,
      address,
    }) => {
      const _webAuthn = webAuthn ? { ...webAuthn } : undefined;

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
      navigate(redirect());
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

  const selectConnector = async (connector: string) => {
    const isWalletConnectorOpen = await fuel.selectConnector(connector);
    setIsAnyWalletConnectorOpen(isWalletConnectorOpen);

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
      select: selectConnector,
      has: !!connectors?.length,
      isAnyWalletConnectorOpen,
    },
  };
};

export { useSignIn };
