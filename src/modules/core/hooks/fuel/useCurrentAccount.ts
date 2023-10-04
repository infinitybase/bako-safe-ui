import { useQuery } from 'react-query';

import { FuelQueryKeys } from './types';
import { useFuel } from './useFuel';

const useCurrentAccount = () => {
  const [fuel] = useFuel();

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

export { useCurrentAccount };
