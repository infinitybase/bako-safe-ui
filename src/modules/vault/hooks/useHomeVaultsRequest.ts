import { useQuery } from 'react-query';

import { useAuthStore } from '@/modules/auth';
import { SortOption } from '@/modules/transactions/services';

import { VaultService } from '../services';

const useHomeVaultsRequest = (vaultsPerPage: number) => {
  const { account } = useAuthStore();

  return useQuery(['predicate/home', account], () =>
    VaultService.getAllWithPagination({
      page: 0,
      perPage: vaultsPerPage,
      orderBy: 'createdAt',
      sort: SortOption.DESC,
    }),
  );
};

export { useHomeVaultsRequest };
