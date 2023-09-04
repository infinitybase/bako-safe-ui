import { useNavigate } from 'react-router-dom';

import { Pages, useDidMountEffect, useFuelConnection } from '@/modules/core';

const useSignIn = () => {
  const navigate = useNavigate();

  const { connect, isConnecting, isConnected, isValidAccount } =
    useFuelConnection();

  const goToApp = () => {
    if (isConnected) {
      return navigate(Pages.home());
    }

    connect();
  };

  useDidMountEffect(() => {
    connect();
  }, [connect]);

  return { isConnected, isConnecting, connect, isValidAccount, goToApp };
};

export { useSignIn };
