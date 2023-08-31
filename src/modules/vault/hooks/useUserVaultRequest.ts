import { useQuery } from 'react-query';

import { PredicateService } from '../services';

const useUserVaultRequest = (account?: string) => {
  return useQuery(['predicate/by-address', account], () =>
    account ? PredicateService.findByAddresses(account) : [],
  );
};

export { useUserVaultRequest };
