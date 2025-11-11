import { usePrivy } from '@privy-io/react-auth';
import { TypeUser } from 'bakosafe';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useContactToast } from '@/modules/addressBook';
import { Encoder, localStorageKeys } from '@/modules/auth/services';
import { Pages } from '@/modules/core';
import { useNetworks } from '@/modules/network/hooks';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { useQueryParams } from '../usePopup';
import { useSocial } from '../useSocial';
import { useCreateUserRequest, useSignInRequest } from '../useUserRequest';

export const useSocialSignIn = () => {
  const navigate = useNavigate();
  const { location } = useQueryParams();

  const { ready, authenticated, user, isModalOpen, login, logout } = usePrivy();
  const { wallet, walletsReady, signMessage } = useSocial();
  const { fromConnector } = useNetworks();
  const { authDetails, invalidateGifAnimationRequest } = useWorkspaceContext();
  const createUserRequest = useCreateUserRequest();
  const signInRequest = useSignInRequest();
  const { errorToast } = useContactToast();

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
      !!wallet &&
      authenticated &&
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
  ]);

  return {
    isAuthenticated: authenticated,
    user,
    isModalOpen,
    connect,
    disconnect,
  };
};
