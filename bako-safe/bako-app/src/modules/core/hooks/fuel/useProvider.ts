import { useFuel } from '@fuels/react';
import { useQuery } from '@tanstack/react-query';

import { FuelQueryKeys } from '@/modules/core/hooks/fuel/types';

const useProvider = () => {
  const { fuel } = useFuel();

  const { data, ...query } = useQuery({
    queryKey: [FuelQueryKeys.PROVIDER],
    queryFn: () => fuel.getProvider(),
    enabled: !!fuel,
  });

  return {
    provider: data,
    ...query,
  };
};

export { useProvider };
