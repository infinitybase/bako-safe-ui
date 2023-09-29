import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Pages, useFuelConnection } from '@/modules/core';

const useSignIn = () => {
  const navigate = useNavigate();

  const { connect, isConnecting, isConnected, isValidAccount, account } =
    useFuelConnection();

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
  };
};

export { useSignIn };
