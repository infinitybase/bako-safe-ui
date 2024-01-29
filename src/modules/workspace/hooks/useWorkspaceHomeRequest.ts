import { useQuery } from 'react-query';

import { WorkspacesQueryKey } from '@/modules/core/models/workspace';

import { WorkspaceService } from '../services';

const useWorkspaceHomeRequest = () => {
  return useQuery(WorkspacesQueryKey.HOME(), () => WorkspaceService.home(), {
    refetchOnWindowFocus: false,
  });
};

export { useWorkspaceHomeRequest };
