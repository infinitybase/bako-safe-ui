import { useQuery } from 'react-query';

import { useFuel, useFuelAccount } from '@/modules';

import { FuelQueryKeys } from './types';

const useWallet = (account?: string) => {
  const [fuel] = useFuel();

  return useQuery(
    [FuelQueryKeys.WALLET, account],
    () => fuel?.getWallet(account!),
    {
      enabled: !!fuel && !!account,
    },
  );
};

const useMyWallet = () => {
  const { account: currentAccount } = useFuelAccount();
  //currentAccount.getBalances();
  return useWallet(currentAccount);
};

export { useMyWallet, useWallet };
