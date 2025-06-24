import { useFuel } from '@fuels/react';
import { useEffect, useState } from 'react';

import { useQueryParams } from '@/modules';
import { useContactToast } from '@/modules/addressBook';
import { useGetCurrentDappNetworkRequest } from '@/modules/dapp/hooks';
import { useNetworks } from '@/modules/network/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { ENetworks } from '@/utils/constants';

import { localStorageKeys, TypeUser } from '../../services';
import { useCreateUserRequest, useSignInRequest } from '../useUserRequest';

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
  const getNetDappRequest = useGetCurrentDappNetworkRequest();
  const { sessionId } = useQueryParams();

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

  const handleSelectWallet = async (connector: string) => {
    const isWalletConnectorOpen = await fuel.selectConnector(connector);
    setIsAnyWalletConnectorOpen(isWalletConnectorOpen);
    await connect();
  };

  const connect = async () => {
    try {
      const connected = await fuel.connect();

      if (!connected) return;

      const account = await fuel.currentAccount();

      const isForcedSameNetDapp =
        sessionStorage.getItem('forceLoginSameNetworkDapp') === 'true';

      const network = isForcedSameNetDapp
        ? { url: await getNetDappRequest.mutateAsync(sessionId ?? '') }
        : await fuel.currentNetwork();

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
              sessionStorage.removeItem('forceLoginSameNetworkDapp');
            }
          },
        },
      );
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
    handleSelectWallet,
    isAnyWalletConnectorOpen,
  };
};

export { useWalletSignIn };
