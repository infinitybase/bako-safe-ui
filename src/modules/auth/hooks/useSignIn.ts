import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFuel } from '@/modules/core';

import { useFuelAccount } from '../store';

const useSignIn = () => {
  const navigate = useNavigate();

  const [fuel] = useFuel();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isValidAccount, setIsValidAccount] = useState(false);

  const { setAccount } = useFuelAccount();

  const goToApp = () => {
    if (isConnected) {
      return navigate('/home');
    }

    connect();
  };

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      await fuel.connect();
    } finally {
      setIsConnecting(false);
    }
  }, [fuel]);

  useEffect(() => {
    async function handleConnection() {
      try {
        const isConnected = await fuel.isConnected();
        setIsValidAccount(false);
        const authAccounts = await fuel.accounts();
        const account = await fuel.currentAccount();

        if (authAccounts.includes(account)) {
          setAccount(account);
          setIsConnected(isConnected);
          setIsValidAccount(true);
        }
      } catch (e) {
        setIsValidAccount(false);
      }
    }

    fuel?.on(fuel.events.connection, handleConnection);
    fuel?.on(fuel.events.currentAccount, handleConnection);

    return () => {
      fuel?.off(fuel.events.connection, handleConnection);
    };
  }, [fuel, setAccount]);

  useEffect(() => {
    connect();
  }, [connect]);

  return { isConnected, isConnecting, connect, isValidAccount, goToApp };
};

export { useSignIn };
