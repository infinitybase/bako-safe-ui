import { useQuery } from '@tanstack/react-query';

import { WorkspacesQueryKey } from '@/modules/core';
import { WorkspaceService } from '@/modules/workspace/services';
import { CookieName, CookiesConfig } from '@/config/cookies';

const useGetWorkspaceRequest = (workspaceId: string) => {
  const { data, ...request } = useQuery({
    queryKey: WorkspacesQueryKey.GET(workspaceId),
    queryFn: () => WorkspaceService.getById(workspaceId),
    enabled:
      !!workspaceId && !!CookiesConfig.getCookie(CookieName.ACCESS_TOKEN),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    workspace: data,
    ...request,
  };
};

export { useGetWorkspaceRequest };
