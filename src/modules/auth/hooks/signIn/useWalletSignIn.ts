import { useFuel } from '@fuels/react';
import { useEffect, useState } from 'react';

import { useContactToast } from '@/modules/addressBook';
import { useNetworks } from '@/modules/network/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { ENetworks } from '@/utils/constants';
import { EConnectors } from '@/modules/core/hooks/fuel/useListConnectors';

import { localStorageKeys, TypeUser } from '../../services';
import { useCreateUserRequest, useSignInRequest } from '../useUserRequest';
import { useEvm } from '@/modules';

export type UseWalletSignIn = ReturnType<typeof useWalletSignIn>;

const useWalletSignIn = (
  callback: (vaultId?: string, workspaceId?: string) => void,
) => {
  const [isAnyWalletConnectorOpen, setIsAnyWalletConnectorOpen] =
    useState(false);

  const { fuel } = useFuel();
  const { authDetails, invalidateGifAnimationRequest } = useWorkspaceContext();
  const { errorToast } = useContactToast();
  const { fromConnector } = useNetworks();
  const {
    connect: evmConnect,
    isConnected: evmIsConnected,
    addresses: evmAddresses,
    requestSignatures: evmRequestSignatures,
  } = useEvm(callback);

  const signInRequest = useSignInRequest({
    onSuccess: ({
      accessToken,
      avatar,
      user_id,
      workspace,
      address,
      rootWallet,
      provider,
      first_login,
    }) => {
      authDetails.handlers.authenticate({
        userId: user_id,
        avatar: avatar!,
        account: address,
        accountType: TypeUser.FUEL,
        accessToken: accessToken,
        singleWorkspace: workspace.id,
        permissions: workspace.permissions,
        provider_url: provider,
        first_login,
      });
      invalidateGifAnimationRequest();
      callback(rootWallet, workspace.id);
    },
  });

  const createUserRequest = useCreateUserRequest({
    onSuccess: ({ code, type }) => {
      signInRequest.mutate({
        code,
        type,
      });
    },
    onError: (message) => {
      errorToast({
        title: 'Login error',
        description: (message as { message: string }).message,
      });
    },
  });

  const fuelWalletConnect = async (connector: string) => {
    const isWalletConnectorOpen = await fuel.selectConnector(connector);
    setIsAnyWalletConnectorOpen(isWalletConnectorOpen);
    await connect();
  };

  const evmWalletConnect = async (_connector: string) => {
    await evmConnect();
  };

  const handler: Record<string, (connector: string) => Promise<void>> = {
    [EConnectors.FUEL]: fuelWalletConnect,
    [EConnectors.FULLET]: fuelWalletConnect,
    [EConnectors.EVM]: evmWalletConnect,
  };

  const handleSelectWallet = async (connector: string) => {
    if (handler[connector]) {
      handler[connector](connector);
    }
  };

  const connect = async () => {
    try {
      const connected = await fuel.connect();

      if (!connected) return;

      const network = await fuel.currentNetwork();
      const account = await fuel.currentAccount();

      if (network.url === ENetworks.BETA_5) {
        throw Error;
      }

      createUserRequest.mutate(
        {
          address: account!,
          provider: network!.url,
          type: TypeUser.FUEL,
        },
        {
          onSuccess: () => {
            if (fromConnector) {
              localStorage.removeItem(localStorageKeys.SELECTED_NETWORK);
            }
          },
        },
      );
    } catch (e) {
      authDetails.handlers.setInvalidAccount?.(true);
    } finally {
      setIsAnyWalletConnectorOpen(false);
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

  useEffect(() => {
    if (!evmIsConnected || evmAddresses?.length === 0) return;
    evmRequestSignatures();
  }, [evmIsConnected, evmAddresses]);

  return {
    handleSelectWallet,
    isAnyWalletConnectorOpen,
  };
};

export { useWalletSignIn };
