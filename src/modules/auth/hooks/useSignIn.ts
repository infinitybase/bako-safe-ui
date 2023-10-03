import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { Pages, useFuelConnection } from '@/modules/core';

import { useCreateUserRequest, useSignInRequest } from './useUserRequest';

const useSignIn = () => {
  const navigate = useNavigate();

  const createUserRequest = useCreateUserRequest({
    onSuccess: ({ address, id, provider }) => {
      signInRequest.mutate({
        address,
        provider,
        user_id: id,
      });
    },
  });

  const signInRequest = useSignInRequest({
    onSuccess: ({ accessToken }) => {
      CookiesConfig.setCookies([
        {
          name: CookieName.ACCESS_TOKEN,
          value: accessToken,
        },
      ]);
      navigate(Pages.home());
    },
  });

  const { connect, isConnecting, isConnected, isValidAccount, account } =
    useFuelConnection({
      onChangeAccount: (account, provider) => {
        createUserRequest.mutate({ address: account, provider });
      },
    });

  const goToApp = async () => {
    if (isConnected) {
      return navigate(Pages.home());
    }

    connect();
  };

  useEffect(() => {
    if (account) {
      return navigate(Pages.home());
    }
  }, [account, navigate]);

  return {
    isConnected,
    isConnecting,
    connect,
    isValidAccount,
    goToApp,
    signInRequest,
    createUserRequest,
  };
};

export { useSignIn };
