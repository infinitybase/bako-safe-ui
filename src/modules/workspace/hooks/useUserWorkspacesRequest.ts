import { useQuery } from 'react-query';

import { WorkspacesQueryKey } from '@/modules/core/models/workspace';

import { WorkspaceService } from '../services';

const useUserWorkspacesRequest = () => {
  return useQuery(
    WorkspacesQueryKey.LIST_BY_USER(),
    () => WorkspaceService.list(),
    {
      refetchOnWindowFocus: false,
    },
  );
};

export { useUserWorkspacesRequest };
