import { useFuel } from '@fuels/react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { FuelQueryKeys } from './types';

const useCurrentAccount = () => {
  const { fuel } = useFuel();

  const { data, ...query } = useQuery({
    queryKey: [FuelQueryKeys.CURRENT_ACCOUNT],
    queryFn: async () => {
      return fuel?.currentAccount();
    },

    enabled: !!fuel,
  });

  return {
    account: data,
    ...query,
  };
};

const useGetCurrentAccount = () => {
  const { fuel } = useFuel();

  const { data, mutateAsync, ...query } = useMutation({
    mutationKey: [FuelQueryKeys.CURRENT_ACCOUNT],
    mutationFn: async () => {
      return fuel?.currentAccount();
    },
  });

  return {
    account: data,
    getAccount: mutateAsync,
    ...query,
  };
};

export { useCurrentAccount, useGetCurrentAccount };
