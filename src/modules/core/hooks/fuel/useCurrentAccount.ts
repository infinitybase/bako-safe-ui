import { useFuel } from '@fuels/react';
import { useMutation, useQuery } from 'react-query';

import { FuelQueryKeys } from './types';

const useCurrentAccount = () => {
  const { fuel } = useFuel();

  const { data, ...query } = useQuery(
    FuelQueryKeys.CURRENT_ACCOUNT,
    async () => {
      return fuel?.currentAccount();
    },
    {
      enabled: !!fuel,
    },
  );

  return {
    account: data,
    ...query,
  };
};

const useGetCurrentAccount = () => {
  const { fuel } = useFuel();

  const { data, mutateAsync, ...query } = useMutation(
    FuelQueryKeys.CURRENT_ACCOUNT,
    async () => {
      return fuel?.currentAccount();
    },
  );

  return {
    account: data,
    getAccount: mutateAsync,
    ...query,
  };
};

export { useCurrentAccount, useGetCurrentAccount };
