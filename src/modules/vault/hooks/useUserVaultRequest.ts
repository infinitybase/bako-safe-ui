import { useQuery } from 'react-query';

import { VaultService } from '../services';

const useUserVaultRequest = (account?: string) => {
  return useQuery(['predicate/by-address', account], () =>
    account ? VaultService.findPredicates(account) : [],
  );
};

export { useUserVaultRequest };
