import { useQuery } from '@tanstack/react-query';

import { workspaceService } from '@/modules/services/services-initializer';

import { WorkspacesQueryKey } from '../utils';

const useUserWorkspacesRequest = () => {
  return useQuery({
    queryKey: WorkspacesQueryKey.LIST_BY_USER(),
    queryFn: () => workspaceService.list(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    // enabled: !!CookiesConfig.getCookie(CookieName.ACCESS_TOKEN),
    enabled: false,
  });
};

export { useUserWorkspacesRequest };
