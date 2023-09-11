import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Pages, useDidMountEffect, useFuelConnection } from '@/modules/core';

const useSignIn = () => {
  const navigate = useNavigate();

  const { connect, isConnecting, isConnected, isValidAccount, network } =
    useFuelConnection();

  const goToApp = () => {
    if (isConnected) {
      return navigate(Pages.home());
    }

    connect();
  };

  const isBeta3 = useMemo(() => {
    if (network.includes('localhost')) {
      return true;
    }

    return network === import.meta.env.VITE_NETWORK_BETA_3;
  }, [network]);

  useDidMountEffect(() => {
    if (!isConnected) {
      connect();
    }
  }, [connect, isConnected]);

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
