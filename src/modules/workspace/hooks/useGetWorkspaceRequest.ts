import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { useAuth } from '@/modules/auth/hooks/useAuth';
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

const useGetCurrentWorkspace = () => {
  const { workspaces } = useAuth();

  return useGetWorkspaceRequest(workspaces.current);
};

const useGetSingleWorkspace = () => {
  const { workspaces } = useAuth();

  return useGetWorkspaceRequest(workspaces.single);
};

export {
  useGetCurrentWorkspace,
  useGetSingleWorkspace,
  useGetWorkspaceRequest,
};
