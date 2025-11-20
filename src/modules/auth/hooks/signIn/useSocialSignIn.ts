import { usePrivy } from '@privy-io/react-auth';
import { TypeUser } from 'bakosafe';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useContactToast } from '@/modules/addressBook';
import { Encoder, localStorageKeys } from '@/modules/auth/services';
import { useNetworks } from '@/modules/network/hooks';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { useSocial } from '../useSocial';
import { useCreateUserRequest, useSignInRequest } from '../useUserRequest';

export type UseSocialSignIn = ReturnType<typeof useSocialSignIn>;

export const useSocialSignIn = (
  signInCallback: (vaultId?: string, workspaceId?: string) => void,
  tryAutoConnect = false,
) => {
  const [triedToConnect, setTriedToConnect] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { ready, authenticated, user, isModalOpen, login, logout } = usePrivy();
  const { wallet, walletsReady, signMessage } = useSocial();
  const { fromConnector } = useNetworks();
  const { authDetails } = useWorkspaceContext();
  const createUserRequest = useCreateUserRequest();
  const signInRequest = useSignInRequest();
  const { errorToast } = useContactToast();

  const unableToConnect = useMemo(
    () => !ready || authenticated || isModalOpen || isLoggingOut,
    [ready, authenticated, isModalOpen, isLoggingOut],
  );

  const connect = useCallback(async () => {
    login();
  }, [login]);

  const disconnect = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  const handleSignIn = async (address: string) => {
    try {
      const { code } = await createUserRequest.mutateAsync({
        address,
        provider: fromConnector
          ? (localStorage.getItem(localStorageKeys.SELECTED_NETWORK) ??
            import.meta.env.VITE_MAINNET_NETWORK)
          : import.meta.env.VITE_MAINNET_NETWORK,
        type: TypeUser.SOCIAL,
      });

      const signature = await signMessage(code);
      const result = await signInRequest.mutateAsync({
        code,
        type: TypeUser.SOCIAL,
        encoder: Encoder.EVM,
        account: address,
        signature,
      });

      authDetails.handlers.authenticate({
        userId: result.user_id,
        avatar: result.avatar,
        account: result.address,
        accountType: TypeUser.SOCIAL,
        accessToken: result.accessToken,
        singleWorkspace: result.workspace.id,
        permissions: result.workspace.permissions,
        provider_url: result.provider,
        first_login: result.first_login,
      });

      signInCallback(result.rootWallet, result.workspace.id);
    } catch (e) {
      const message =
        typeof e === 'object' && e !== null && 'message' in e
          ? String((e as { message: unknown }).message)
          : String(e);

      console.error(message);
      errorToast({
        title: 'Login error',
        description: message,
      });

      // Disconnect user from Privy if the user rejects the signature request
      if (message.includes('user rejected the request')) {
        disconnect();
      }
    }
  };

  // Checks if the user is already logged in and, if not, logs in with the Privy wallet
  useEffect(() => {
    if (
      !authDetails.userInfos.address &&
      ready &&
      walletsReady &&
      !!wallet &&
      authenticated &&
      triedToConnect &&
      user?.wallet?.address
    ) {
      handleSignIn(wallet.address);
    }
  }, [
    authenticated,
    user,
    ready,
    walletsReady,
    authDetails.userInfos.address,
    wallet,
    triedToConnect,
  ]);

  useEffect(() => {
    if (isModalOpen) setTriedToConnect(true);
  }, [isModalOpen]);

  useEffect(() => {
    // Waiting for Privy SDK to be ready
    if (!ready) return;

    // If user is authenticated and has not yet attempted to connect => disconnect
    if (authenticated && !isLoggingOut && !triedToConnect) {
      disconnect();
      return;
    }

    // If SDK is ready, user is not authenticated and has not yet attempted to connect => connect
    if (
      !authenticated &&
      !isModalOpen &&
      !isLoggingOut &&
      !triedToConnect &&
      tryAutoConnect
    ) {
      connect();
    }
  }, [
    ready,
    authenticated,
    isModalOpen,
    isLoggingOut,
    triedToConnect,
    connect,
    disconnect,
  ]);

  return {
    ready,
    authenticated,
    isModalOpen,
    triedToConnect,
    isLoggingOut,
    unableToConnect,
    setTriedToConnect,
    connect,
    disconnect,
  };
};
