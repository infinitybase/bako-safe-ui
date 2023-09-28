import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { Pages, useFuelConnection } from '@/modules/core';

import { useCreateUserRequest, useSignInRequest } from './useUserRequest';

const useSignIn = () => {
  const navigate = useNavigate();

  const createUserRequest = useCreateUserRequest({
    onSuccess: ({ address, id, provider }) => {
      console.log(`>>>>> success createUserRequest`, { address, id, provider });
      signInRequest.mutate({
        address,
        provider,
        user_id: id,
      });
    },
  });

  const signInRequest = useSignInRequest({
    onSuccess: ({ accessToken }) => {
      console.log(`>>>>> success createUserRequest`, { accessToken });

      CookiesConfig.setCookies([
        {
          name: CookieName.ACCESS_TOKEN,
          value: accessToken,
        },
      ]);
      navigate(Pages.home());
    },
  });

  const {
    connect,
    isConnecting,
    isConnected,
    isValidAccount,
    network,
    account,
  } = useFuelConnection({
    onChangeAccount: (account, provider) => {
      createUserRequest.mutate({ address: account, provider });
    },
  });

  const isBeta3 = useMemo(() => {
    if (network.includes('localhost')) {
      return true;
    }

    return network === import.meta.env.VITE_NETWORK_BETA_3;
  }, [network]);

  const goToApp = async () => {
    if (isBeta3 && isConnected) {
      return navigate(Pages.home());
    }

    connect();
  };

  useEffect(() => {
    if (account && isBeta3) {
      return navigate(Pages.home());
    }
  }, [account, isBeta3, navigate]);

  return {
    isConnected,
    isConnecting,
    connect,
    isValidAccount,
    goToApp,
    isBeta3,
    signInRequest,
    createUserRequest,
  };
};

export { useSignIn };
