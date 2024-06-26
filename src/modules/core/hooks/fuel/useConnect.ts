import { useFuel } from '@fuels/react';
import { useMutation } from 'react-query';

import { FuelQueryKeys } from './types';

export interface UseConnectParams {
  onConnect?: () => void;
  onError?: () => void;
}

const useConnect = (params?: UseConnectParams) => {
  const { fuel } = useFuel();

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

const useDisconnect = () => {
  const { fuel } = useFuel();

  const mutation = useMutation(FuelQueryKeys.DISCONNECT, () => {
    return fuel?.disconnect();
  });

  return {
    discconnect: mutation.mutateAsync,
    ...mutation,
  };
};

export { useConnect, useDisconnect };
