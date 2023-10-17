import { useQuery } from 'react-query';

import { useFuelAccount } from '@/modules/auth';

import { VaultService } from '../services';

const useHomeVaultsRequest = (vaultsPerPage: number) => {
  const { account } = useFuelAccount();

  return useQuery(['predicate/home', account], () =>
    VaultService.getAllWithPagination({ page: 0, perPage: vaultsPerPage }),
  );
};

export { useHomeVaultsRequest };
