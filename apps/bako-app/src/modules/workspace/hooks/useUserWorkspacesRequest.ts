import { useQuery } from '@tanstack/react-query';

import { WorkspacesQueryKey } from '@/modules/core/models/workspace';

import { WorkspaceService } from '../services';

const useUserWorkspacesRequest = () => {
  return useQuery({
    queryKey: WorkspacesQueryKey.LIST_BY_USER(),
    queryFn: () => WorkspaceService.list(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // enabled: !!CookiesConfig.getCookie(CookieName.ACCESS_TOKEN),
    enabled: false,
  });
};

export { useUserWorkspacesRequest };
