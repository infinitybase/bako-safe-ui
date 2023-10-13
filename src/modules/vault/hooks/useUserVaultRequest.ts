import { useQuery } from 'react-query';

import { useFuelAccount } from '@/modules/auth';

import { VaultService } from '../services';

const useUserVaultRequest = () => {
  const { account } = useFuelAccount();

  return useQuery(
    ['predicate/by-address', account],
    () => VaultService.getAll(),
    {
      initialData: [],
    },
  );
};

export { useUserVaultRequest };
