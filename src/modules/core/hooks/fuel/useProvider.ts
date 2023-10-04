import { useQuery } from 'react-query';

import { useFuel } from '@/modules';
import { FuelQueryKeys } from '@/modules/core/hooks/fuel/types';

const useProvider = () => {
  const [fuel] = useFuel();

  const { data, ...query } = useQuery(FuelQueryKeys.PROVIDER, () =>
    fuel.getProvider(),
  );

  return {
    provider: data,
    ...query,
  };
};

export { useProvider };
