import { useFuel } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';

import { FuelQueryKeys } from './types';

const useIsConnected = () => {
  const { fuel } = useFuel();

  const query = useQuery({
    queryKey: [FuelQueryKeys.IS_CONNECTED],
    queryFn: () => fuel.isConnected(),
    enabled: !!fuel,
  });

  return {
    isConnected: query.data,
    ...query,
  };
};

export { useIsConnected };
