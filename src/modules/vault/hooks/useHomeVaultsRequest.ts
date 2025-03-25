import { useQuery } from '@tanstack/react-query';

import {
  SortOption,
  TransactionOrderBy,
} from '@/modules/transactions/services';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { VaultService } from '../services';

const useHomeVaultsRequest = (vaultsPerPage: number) => {
  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();

  return useQuery({
    queryKey: ['predicate/home', userInfos.address],
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
