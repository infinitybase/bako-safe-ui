import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { useFuel } from '@/modules';
import { FuelQueryKeys } from '@/modules/core/hooks/fuel/types';

interface BsafeQueryClientProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

const BsafeQueryClientProvider = (props: BsafeQueryClientProviderProps) => {
  const [fuel] = useFuel();

  function onCurrentAccount() {
    queryClient.invalidateQueries([FuelQueryKeys.CURRENT_ACCOUNT]);
    queryClient.invalidateQueries([FuelQueryKeys.WALLET]);
  }

  function onAccount() {
    queryClient.invalidateQueries([FuelQueryKeys.CURRENT_ACCOUNT]);
    queryClient.invalidateQueries([FuelQueryKeys.WALLET]);
  }

  function onConnection() {
    queryClient.invalidateQueries([FuelQueryKeys.CURRENT_ACCOUNT]);
    queryClient.invalidateQueries([FuelQueryKeys.WALLET]);
    queryClient.invalidateQueries([FuelQueryKeys.IS_CONNECTED]);
    queryClient.invalidateQueries([FuelQueryKeys.PROVIDER]);
  }

  function onNetwork() {
    queryClient.invalidateQueries([FuelQueryKeys.PROVIDER]);
  }

  useEffect(() => {
    fuel?.on(fuel?.events.network, onNetwork);
    fuel?.on(fuel?.events.accounts, onAccount);
    fuel?.on(fuel?.events.connection, onConnection);
    fuel?.on(fuel?.events.currentAccount, onCurrentAccount);

    return () => {
      fuel?.on(fuel?.events.network, onNetwork);
      fuel?.on(fuel?.events.accounts, onAccount);
      fuel?.on(fuel?.events.connection, onConnection);
      fuel?.on(fuel?.events.currentAccount, onCurrentAccount);
    };
  }, [fuel]);

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export { BsafeQueryClientProvider, queryClient };
