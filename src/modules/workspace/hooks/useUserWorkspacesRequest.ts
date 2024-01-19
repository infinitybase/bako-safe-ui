import { useQuery } from 'react-query';

import { WorkspacesQueryKey } from '@/modules/core/models/workspace';

import { WorkspaceService } from '../services';

const useUserWorkspacesRequest = (account: string) => {
  return useQuery(
    [WorkspacesQueryKey.LIST_BY_USER],
    () => WorkspaceService.list(account),
    {
      refetchOnWindowFocus: false,
    },
  );
};

export { useUserWorkspacesRequest };
