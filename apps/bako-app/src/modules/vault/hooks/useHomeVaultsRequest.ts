import { TransactionOrderBy } from '@bako-safe/services/modules/transaction';
import { SortOption } from '@bako-safe/services/types';
import { useQuery } from '@tanstack/react-query';

import { vaultService } from '@/config/services-initializer';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const useHomeVaultsRequest = (vaultsPerPage: number) => {
  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();

  return useQuery({
    queryKey: ['predicate/home', userInfos.address],
    queryFn: () =>
      vaultService.getAllWithPagination({
        page: 0,
        perPage: vaultsPerPage,
        orderBy: TransactionOrderBy.CREATED_AT,
        sort: SortOption.DESC,
      }),
  });
};

export { useHomeVaultsRequest };
