import { useCallback, useEffect, useState } from 'react';

import { useFuelAccount } from '@/modules';

import { useFuel } from './useFuel.ts';

const useFuelConnection = () => {
  const [fuel] = useFuel();

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isValidAccount, setIsValidAccount] = useState(false);
  const [network, setNetowrk] = useState('');

  const { account, setAccount } = useFuelAccount();

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
        setIsValidAccount(false);

        const isConnected = await fuel.isConnected();
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
    const getWalletNetwork = async () => {
      if (!isConnected) return;

      const network = await fuel.network();
      setNetowrk(network.url);
    };

    if (!network) {
      getWalletNetwork();
    }

    fuel?.on(fuel.events.network, getWalletNetwork);

    return () => {
      fuel?.off(fuel.events.network, getWalletNetwork);
    };
  }, [fuel, isConnected]);

  return {
    isConnected,
    isConnecting,
    isValidAccount,
    connect,
    network,
    account,
  };
};

export { useFuelConnection };
