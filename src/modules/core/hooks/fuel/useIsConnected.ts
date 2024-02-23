import { useFuel } from '@fuels/react';
import { useQuery } from 'react-query';

import { FuelQueryKeys } from './types';

const useIsConnected = () => {
  const { fuel } = useFuel();

  const query = useQuery(FuelQueryKeys.IS_CONNECTED, () => fuel.isConnected(), {
    enabled: !!fuel,
  });

  return {
    isConnected: query.data,
    ...query,
  };
};

export { useIsConnected };
