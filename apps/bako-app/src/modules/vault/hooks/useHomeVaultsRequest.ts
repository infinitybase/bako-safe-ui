import { TransactionOrderBy } from '@bako-safe/services/modules/transaction';
import { VaultService } from '@bako-safe/services/modules/vault';
import { SortOption } from '@bako-safe/services/types';
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
