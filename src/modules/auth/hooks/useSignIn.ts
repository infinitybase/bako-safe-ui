import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { useFuel, useFuelAccount, useGetCurrentAccount } from '@/modules';
import { Pages, useConnect, useIsConnected } from '@/modules/core';

import { useCreateUserRequest, useSignInRequest } from './useUserRequest';

const FUEL_CONNECTOR_NAME = 'Fuel Wallet';
const FUELET_CONNECTOR_NAME = 'Fuelet Wallet';

const useSignIn = () => {
  const navigate = useNavigate();

  const [fuel] = useFuel();
  const { setAccount, setAvatar, setInvalidAccount } = useFuelAccount();
  const { isConnected } = useIsConnected();
  const { connect, isConnecting } = useConnect();
  const { getAccount, account } = useGetCurrentAccount();

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
      navigate(Pages.home());
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
      console.log({ e });
    }
  };

  const redirectToWalletLink = () =>
    window.open(import.meta.env.VITE_FUEL_WALLET_URL, '_BLANK');

  const isFuelConnector = fuel?.connectorName === FUEL_CONNECTOR_NAME;

  useEffect(() => {
    if (!fuel) return;

    const hasFueletConnector = fuel.hasConnector(FUELET_CONNECTOR_NAME);

    if (hasFueletConnector) {
      fuel.removeConnector(FUELET_CONNECTOR_NAME);
    }

    fuel
      .selectConnector(FUEL_CONNECTOR_NAME)
      .catch(() => fuel.selectConnector(''));
  }, [fuel]);

  return {
    connect,
    goToApp,
    signInRequest,
    isConnected,
    isConnecting:
      isConnecting || signInRequest.isLoading || createUserRequest.isLoading,
    createUserRequest,
    hasFuel: !!fuel && isFuelConnector,
    redirectToWalletLink,
  };
};

export { useSignIn };
