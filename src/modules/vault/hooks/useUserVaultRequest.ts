import { useQuery } from 'react-query';

import { VaultService } from '../services';

const useUserVaultRequest = () => {
  return useQuery(['predicate/by-address'], () => VaultService.getAll(), {
    initialData: [],
  });
};

export { useUserVaultRequest };
