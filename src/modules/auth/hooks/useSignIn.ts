import { useDisclosure } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { CookieName, CookiesConfig } from '@/config/cookies';
import {
  useFuel,
  useFuelAccount,
  useGetCurrentAccount,
  useQueryParams,
} from '@/modules';
import { Pages, useConnect, useIsConnected } from '@/modules/core';

import { useCreateUserRequest, useSignInRequest } from './useUserRequest';

const useSignIn = () => {
  const navigate = useNavigate();
  const drawer = useDisclosure();

  const [fuel] = useFuel();
  const { setAccount, setAvatar, setInvalidAccount } = useFuelAccount();
  const { isConnected } = useIsConnected();
  const { connect, isConnecting } = useConnect();
  const { getAccount, account } = useGetCurrentAccount();
  const { location, origin } = useQueryParams();

  const connectors = useMemo(() => {
    return fuel ? fuel.listConnectors() : [];
  }, [fuel]);

  const hasFuel = !!fuel;

  const signInRequest = useSignInRequest({
    onSuccess: ({ accessToken, avatar }) => {
      CookiesConfig.setCookies([
        {
          name: CookieName.ACCESS_TOKEN,
          value: accessToken,
        },
        {
          name: CookieName.ADDRESS,
          value: account!,
        },
        {
          name: CookieName.AVATAR,
          value: avatar!,
        },
      ]);
      setAccount(account!);
      setAvatar(avatar!);

      origin
        ? navigate(`${Pages.dappAuth()}${location.search}&address=${account}`)
        : navigate(Pages.home());
    },
  });

  const createUserRequest = useCreateUserRequest({
    onSuccess: ({ address, id, provider }) => {
      signInRequest.mutate({
        address,
        provider,
        user_id: id,
      });
    },
  });

  const goToApp = async () => {
    try {
      const connected = await connect();

      if (!connected) return;

      const network = await fuel.network();
      const account = await getAccount();

      createUserRequest.mutate({
        address: account!,
        provider: network!.url,
      });
    } catch (e) {
      setInvalidAccount(true);
    }
  };

  const redirectToWalletLink = () =>
    window.open(import.meta.env.VITE_FUEL_WALLET_URL, '_BLANK');

  return {
    connect,
    goToApp,
    signInRequest,
    isConnected,
    isConnecting:
      isConnecting || signInRequest.isLoading || createUserRequest.isLoading,
    createUserRequest,
    connectors,
    drawer,
    hasFuel,
    redirectToWalletLink,
  };
};

export { useSignIn };
