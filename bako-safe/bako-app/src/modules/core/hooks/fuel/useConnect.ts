import { useFuel } from '@fuels/react';
import { useMutation } from '@tanstack/react-query';

import { FuelQueryKeys } from './types';

export interface UseConnectParams {
  onConnect?: () => void;
  onError?: () => void;
}

const useConnect = (params?: UseConnectParams) => {
  const { fuel } = useFuel();

  const mutation = useMutation({
    mutationKey: [FuelQueryKeys.CONNECT],
    mutationFn: () => {
      return fuel?.connect();
    },
    onSuccess: params?.onConnect,
    onError: params?.onError,
  });

  return {
    connect: mutation.mutateAsync,
    isConnecting: mutation.isPending,
    ...mutation,
  };
};

const useDisconnect = () => {
  const { fuel } = useFuel();

  const mutation = useMutation({
    mutationKey: [FuelQueryKeys.DISCONNECT],
    mutationFn: () => {
      return fuel?.disconnect();
    },
  });

  return {
    discconnect: mutation.mutateAsync,
    ...mutation,
  };
};

export { useConnect, useDisconnect };
