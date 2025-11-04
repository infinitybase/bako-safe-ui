import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useContactToast } from '@/modules/addressBook';
import { Encoder, localStorageKeys, TypeUser } from '@/modules/auth/services';
import { Pages } from '@/modules/core';
import { useNetworks } from '@/modules/network/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useQueryParams } from '../usePopup';
import { useCreateUserRequest, useSignInRequest } from '../useUserRequest';

export const useSocialSignIn = () => {
  const navigate = useNavigate();
  const { location } = useQueryParams();

  const { ready, authenticated, user, isModalOpen, login, logout } = usePrivy();
  const { wallets, ready: walletsReady } = useWallets();
  const { fromConnector } = useNetworks();
  const { authDetails, invalidateGifAnimationRequest } = useWorkspaceContext();
  const createUserRequest = useCreateUserRequest();
  const signInRequest = useSignInRequest();
  const { errorToast } = useContactToast();

  const privyWallet = useMemo(
    () => wallets.find((wallet) => wallet.walletClientType === 'privy'),
    [wallets],
  );

  const connect = useCallback(async () => {
    login();
  }, [login]);

  const disconnect = useCallback(async () => {
    await logout();
  }, [logout]);

  const redirect = useCallback(() => {
    const isRedirectToPrevious = !!location.state?.from;

    if (isRedirectToPrevious) {
      navigate(location.state.from);
      return;
    }

    navigate(`${Pages.dappAuth()}${location.search}`);
  }, [location.search, location.state?.from, navigate]);

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

      const signature = await privyWallet?.sign(code);
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

      invalidateGifAnimationRequest();
      redirect();
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
      !!privyWallet &&
      authenticated &&
      user?.wallet?.address
    ) {
      handleSignIn(privyWallet.address);
    }
  }, [
    authenticated,
    user,
    ready,
    walletsReady,
    authDetails.userInfos.address,
    privyWallet,
  ]);

  return {
    isAuthenticated: authenticated,
    user,
    isModalOpen,
    connect,
    disconnect,
  };
};
