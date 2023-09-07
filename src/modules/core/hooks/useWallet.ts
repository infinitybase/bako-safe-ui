import { useQuery } from 'react-query';

import { useFuel, useFuelAccount } from '@/modules';

const useWallet = (account?: string) => {
  const [fuel] = useFuel();
  const { account: currentAccount } = useFuelAccount();

  return useQuery('wallet', () => fuel.getWallet(account || currentAccount));
};

export { useWallet };
