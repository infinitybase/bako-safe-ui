import { SortOption, TransactionOrderBy } from '@services/modules/transaction';
import { VaultService } from '@services/modules/vault';
import { useQuery } from '@tanstack/react-query';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

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
