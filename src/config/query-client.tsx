import { useFuel } from '@fuels/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect } from 'react';

import { FuelQueryKeys } from '@/modules/core/hooks/fuel/types';

interface BakoSafeQueryClientProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // refetchOnMount: false,
      // staleTime: 1000, // 1 second to prevent request spam
      retry: 4,
      retryDelay: 1000,
    },
  },
});

//force deploy
const BakoSafeQueryClientProvider = (
  props: BakoSafeQueryClientProviderProps,
) => {
  const { fuel } = useFuel();

  function onCurrentAccount() {
    queryClient.invalidateQueries({
      queryKey: [FuelQueryKeys.CURRENT_ACCOUNT],
    });
    queryClient.invalidateQueries({ queryKey: [FuelQueryKeys.WALLET] });
  }

  function onAccount() {
    queryClient.invalidateQueries({
      queryKey: [FuelQueryKeys.CURRENT_ACCOUNT],
    });
    queryClient.invalidateQueries({ queryKey: [FuelQueryKeys.WALLET] });
  }

  function onConnection() {
    queryClient.invalidateQueries({
      queryKey: [FuelQueryKeys.CURRENT_ACCOUNT],
    });
    queryClient.invalidateQueries({ queryKey: [FuelQueryKeys.WALLET] });
    queryClient.invalidateQueries({ queryKey: [FuelQueryKeys.IS_CONNECTED] });
    queryClient.invalidateQueries({ queryKey: [FuelQueryKeys.PROVIDER] });
  }

  function onNetwork() {
    queryClient.invalidateQueries({ queryKey: [FuelQueryKeys.PROVIDER] });
  }

  useEffect(() => {
    fuel?.on(fuel?.events.networks, onNetwork);
    fuel?.on(fuel?.events.accounts, onAccount);
    fuel?.on(fuel?.events.connection, onConnection);
    fuel?.on(fuel?.events.currentAccount, onCurrentAccount);

    return () => {
      fuel?.on(fuel?.events.networks, onNetwork);
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

export { BakoSafeQueryClientProvider, queryClient };
