import { CookieName, CookiesConfig } from '@bako-safe/wallet/config';
import { useQuery } from '@tanstack/react-query';

import { workspaceService } from '@/config/services-initializer';

import { WorkspacesQueryKey } from '../utils';

const useGetWorkspaceRequest = (workspaceId: string) => {
  const { data, ...request } = useQuery({
    queryKey: WorkspacesQueryKey.GET(workspaceId),
    queryFn: () => workspaceService.getById(workspaceId),
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
