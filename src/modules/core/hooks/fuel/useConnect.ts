import { useMutation } from 'react-query';

import { FuelQueryKeys } from './types';
import { useFuel } from './useFuel';

export interface UseConnectParams {
  onConnect?: () => void;
  onError?: () => void;
}

const useConnect = (params?: UseConnectParams) => {
  const [fuel] = useFuel();

  const mutation = useMutation(
    FuelQueryKeys.CONNECT,
    () => {
      return fuel?.connect();
    },
    {
      onSuccess: params?.onConnect,
      onError: params?.onError,
    },
  );

  return {
    connect: mutation.mutateAsync,
    isConnecting: mutation.isLoading,
    ...mutation,
  };
};

export { useConnect };
