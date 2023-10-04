import { useQuery } from 'react-query';

import { FuelQueryKeys } from './types';
import { useFuel } from './useFuel';

const useIsConnected = () => {
  const [fuel] = useFuel();

  const query = useQuery(FuelQueryKeys.IS_CONNECTED, () => fuel.isConnected());

  return {
    isConnected: query.data,
    ...query,
  };
};

export { useIsConnected };
