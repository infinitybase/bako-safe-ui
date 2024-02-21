import { useFuel } from '@fuels/react';
import { useQuery } from 'react-query';

import { FuelQueryKeys } from './types';

const useNetwork = () => {
  const { fuel } = useFuel();

  const { data, ...query } = useQuery(
    FuelQueryKeys.NETWORK,
    async () => {
      return fuel.currentNetwork();
    },
    {
      enabled: !!fuel,
    },
  );

  return {
    network: data,
    ...query,
  };
};

export { useNetwork };
