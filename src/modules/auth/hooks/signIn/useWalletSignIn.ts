import { useFuel } from '@fuels/react';
import { TypeUser } from 'bakosafe';
import { useEffect, useState } from 'react';

import { useEvm } from '@/modules';
import { useContactToast } from '@/modules/addressBook';
import { EConnectors } from '@/modules/core/hooks/fuel/useListConnectors';
import { useNetworks } from '@/modules/network/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import { ENetworks } from '@/utils/constants';

import { Encoder, localStorageKeys } from '../../services';
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
  const {
    connect: evmConnect,
    signAndValidate: evmSignAndValidate,
    modal: evmModal,
    getCurrentAccount: evmGetCurrentAccount,
  } = useEvm();

  const [evmModalIsOpen, setEvmModalIsOpen] = useState<boolean>(false);

  const signInRequest = useSignInRequest();

  const createUserRequest = useCreateUserRequest();

  const fuelWalletConnect = async (connector: string) => {
    const isWalletConnectorOpen = await fuel.selectConnector(connector);
    setIsAnyWalletConnectorOpen(isWalletConnectorOpen);
    await connect();
  };

  const evmWalletConnect = async (_connector: string) => {
    if (!evmModalIsOpen) {
      setEvmModalIsOpen(true);
      await evmConnect();
    }
  };

  const handleSelectEvmWallet = async () => {
    try {
      const address = await evmGetCurrentAccount();
      const { code } = await createUserRequest.mutateAsync({
        address: address,
        provider: fromConnector
          ? (localStorage.getItem(localStorageKeys.SELECTED_NETWORK) ??
            import.meta.env.VITE_MAINNET_NETWORK)
          : import.meta.env.VITE_MAINNET_NETWORK,
        type: TypeUser.EVM,
      });

      const signature = await evmSignAndValidate(code, address);

      const result = await signInRequest.mutateAsync({
        code,
        type: TypeUser.EVM,
        encoder: Encoder.EVM,
        account: address,
        signature,
      });

      authDetails.handlers.authenticate({
        userId: result.user_id,
        avatar: result.avatar!,
        account: result.address,
        accountType: TypeUser.EVM,
        accessToken: result.accessToken,
        singleWorkspace: result.workspace.id,
        permissions: result.workspace.permissions,
        provider_url: result.provider,
        first_login: result.first_login,
      });
      invalidateGifAnimationRequest();
      callback(result.rootWallet, result.workspace.id);
    } catch (e) {
      console.error(e);
      errorToast({
        title: 'Login error',
        description: (e as { message: string }).message,
      });

      // authDetails.handlers.setInvalidAccount?.(true);
    }
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

      const { code, type } = await createUserRequest.mutateAsync({
        address: account!,
        provider: network!.url,
        type: TypeUser.FUEL,
      });

      if (fromConnector) {
        localStorage.removeItem(localStorageKeys.SELECTED_NETWORK);
      }

      const result = await signInRequest.mutateAsync({
        code,
        type,
      });

      authDetails.handlers.authenticate({
        userId: result.user_id,
        avatar: result.avatar!,
        account: result.address,
        accountType: TypeUser.FUEL,
        accessToken: result.accessToken,
        singleWorkspace: result.workspace.id,
        permissions: result.workspace.permissions,
        provider_url: result.provider,
        first_login: result.first_login,
      });

      invalidateGifAnimationRequest();
      callback(result.rootWallet, result.workspace.id);
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
    const unsub = evmModal.subscribeEvents(
      async (event: { data: { event: string } }) => {
        console.log('event.data.event', event.data.event);
        switch (event.data.event) {
          case 'MODAL_OPEN':
            setEvmModalIsOpen(true);
            break;
          case 'MODAL_CLOSE':
          case 'CONNECT_SUCCESS':
            setEvmModalIsOpen(false);
            handleSelectEvmWallet();
            break;
          case 'CONNECT_ERROR': {
            errorToast({
              title: 'Invalid Account',
              description: 'You need to use the evm wallet to connect.',
            });
            break;
          }
          default:
            break;
        }
      },
    );

    return () => {
      unsub();
    };
  }, [evmModal]);

  return {
    handleSelectWallet,
    isAnyWalletConnectorOpen,
  };
};

export { useWalletSignIn };
