import { useQuery } from '@tanstack/react-query';

import {
  SortOption,
  TransactionOrderBy,
} from '@/modules/transactions/services';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
import { DEFAULT_INITIAL_PAGE_PARAM } from '@/utils/constants';

import { VaultService } from '../services';

const useHomeVaultsRequest = (vaultsPerPage: number) => {
  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();

  return useQuery({
    queryKey: ['predicate/home', userInfos.address],
    queryFn: () =>
      VaultService.getAllWithPagination({
        page: DEFAULT_INITIAL_PAGE_PARAM,
        perPage: vaultsPerPage,
        orderBy: TransactionOrderBy.CREATED_AT,
        sort: SortOption.DESC,
      }),
  });
};

export { useHomeVaultsRequest };
