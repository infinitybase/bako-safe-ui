import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Pages, useFuelConnection } from '@/modules/core';

const useSignIn = () => {
  const navigate = useNavigate();

  const {
    connect,
    isConnecting,
    isConnected,
    isValidAccount,
    network,
    account,
  } = useFuelConnection();

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
  };
};

export { useSignIn };
