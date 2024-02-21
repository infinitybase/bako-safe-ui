import { useQuery } from 'react-query';
import { UseQueryOptions } from 'react-query/types/react/types';

import { useAuth } from '@/modules/auth/hooks/useAuth';
import { Workspace, WorkspacesQueryKey } from '@/modules/core';
import { WorkspaceService } from '@/modules/workspace/services';

const useGetWorkspaceRequest = (
  workspaceId: string,
  options?: UseQueryOptions<Workspace, unknown, Workspace, string[]>,
) => {
  const { data, ...request } = useQuery(
    WorkspacesQueryKey.GET(workspaceId),
    () => WorkspaceService.getById(workspaceId),
    {
      ...options,
      enabled: !!workspaceId || options?.enabled,
      refetchOnWindowFocus: false,
    },
  );

  return {
    workspace: data,
    ...request,
  };
};

const useGetCurrentWorkspace = () => {
  const { workspaces } = useAuth();

  return useGetWorkspaceRequest(workspaces.workspace);
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
