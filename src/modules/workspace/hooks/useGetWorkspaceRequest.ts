import { useQuery } from 'react-query';

import { WorkspacesQueryKey } from '@/modules/core';
import { WorkspaceService } from '@/modules/workspace/services';

const useGetWorkspaceRequest = (workspaceId: string) => {
  const { data, ...request } = useQuery(
    WorkspacesQueryKey.GET(workspaceId),
    () => WorkspaceService.getById(workspaceId),
    { enabled: !!workspaceId },
  );

  return {
    workspace: data,
    ...request,
  };
};

export { useGetWorkspaceRequest };
