import { useCallback, useEffect, useState } from 'react';

import { useFuel } from './useFuel.ts';

export type UseFuelConnectParams = {
  onAccountConnect: (account: string) => void;
};

const useFuelConnection = (params?: UseFuelConnectParams) => {
  const [fuel] = useFuel();

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isValidAccount, setIsValidAccount] = useState(false);

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
          params?.onAccountConnect(account);
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
  }, [fuel, params]);

  return { isConnected, isConnecting, isValidAccount, connect };
};

export { useFuelConnection };
