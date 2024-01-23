import { useQuery } from 'react-query';
import { UseQueryOptions } from 'react-query/types/react/types';

import { Workspace, WorkspacesQueryKey } from '@/modules/core';
import { WorkspaceService } from '@/modules/workspace/services';

const useGetWorkspaceRequest = (
  workspaceId: string,
  options?: UseQueryOptions<Workspace, unknown, Workspace, string[]>,
) => {
  const { data, ...request } = useQuery(
    WorkspacesQueryKey.GET(workspaceId),
    () => WorkspaceService.getById(workspaceId),
    { ...options, enabled: !!workspaceId, refetchOnWindowFocus: false },
  );

  return {
    workspace: data,
    ...request,
  };
};

export { useGetWorkspaceRequest };
