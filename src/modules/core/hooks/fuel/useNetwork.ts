import { useQuery } from 'react-query';

import { useFuel } from '@/modules';

import { FuelQueryKeys } from './types';

const useNetwork = () => {
  const [fuel] = useFuel();

  const { data, ...query } = useQuery(
    FuelQueryKeys.NETWORK,
    async () => {
      return fuel.network();
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
