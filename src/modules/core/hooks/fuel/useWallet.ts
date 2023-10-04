import { useQuery } from 'react-query';

import { useFuel, useFuelAccount } from '@/modules';

import { FuelQueryKeys } from './types';

const useWallet = (account?: string) => {
  const [fuel] = useFuel();
  const { account: currentAccount } = useFuelAccount();

  return useQuery(
    [FuelQueryKeys.WALLET, account, currentAccount],
    () => fuel?.getWallet(account || currentAccount),
    {
      enabled: !!fuel,
    },
  );
};

export { useWallet };
