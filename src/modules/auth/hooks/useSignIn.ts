import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFuelConnection } from '@/modules/core';

import { useFuelAccount } from '../store';

const useSignIn = () => {
  const { setAccount } = useFuelAccount();
  const navigate = useNavigate();

  const { connect, isConnecting, isConnected, isValidAccount } =
    useFuelConnection({
      onAccountConnect: (account) => setAccount(account),
    });

  const goToApp = () => {
    if (isConnected) {
      return navigate('/home');
    }

    connect();
  };

  useEffect(() => {
    connect();
  }, [connect]);

  return { isConnected, isConnecting, connect, isValidAccount, goToApp };
};

export { useSignIn };
