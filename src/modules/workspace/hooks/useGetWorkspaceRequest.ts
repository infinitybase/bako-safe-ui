import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { Workspace, WorkspacesQueryKey } from '@/modules/core';
import { WorkspaceService } from '@/modules/workspace/services';

const useGetWorkspaceRequest = (
  workspaceId: string,
  options?: UseQueryOptions<Workspace, unknown, Workspace, string[]>,
) => {
  const { data, ...request } = useQuery({
    queryKey: WorkspacesQueryKey.GET(workspaceId),
    queryFn: () => WorkspaceService.getById(workspaceId),
    ...options,
    enabled: !!workspaceId || options?.enabled,
    refetchOnWindowFocus: false,
  });

  return {
    workspace: data,
    ...request,
  };
};

export { useGetWorkspaceRequest };
