import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/modules/auth';
import {
  SortOption,
  TransactionOrderBy,
} from '@/modules/transactions/services';

import { VaultService } from '../services';

const useHomeVaultsRequest = (vaultsPerPage: number) => {
  const { account } = useAuthStore();

  return useQuery({
    queryKey: ['predicate/home', account],
    queryFn: () =>
      VaultService.getAllWithPagination({
        page: 0,
        perPage: vaultsPerPage,
        orderBy: TransactionOrderBy.CREATED_AT,
        sort: SortOption.DESC,
      }),
  });
};

export { useHomeVaultsRequest };
