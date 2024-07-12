import { useFuel } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';

import { FuelQueryKeys } from './types';

const useNetwork = () => {
  const { fuel } = useFuel();

  const { data, ...query } = useQuery({
    queryKey: [FuelQueryKeys.NETWORK],
    queryFn: async () => {
      return fuel.currentNetwork();
    },
    enabled: !!fuel,
  });

  return {
    network: data,
    ...query,
  };
};

export { useNetwork };
