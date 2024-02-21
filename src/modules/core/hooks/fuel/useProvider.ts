import { useFuel } from '@fuels/react';
import { useQuery } from 'react-query';

import { FuelQueryKeys } from '@/modules/core/hooks/fuel/types';

const useProvider = () => {
  const { fuel } = useFuel();

  const { data, ...query } = useQuery(
    FuelQueryKeys.PROVIDER,
    () => fuel.getProvider(),
    {
      enabled: !!fuel,
    },
  );

  return {
    provider: data,
    ...query,
  };
};

export { useProvider };
