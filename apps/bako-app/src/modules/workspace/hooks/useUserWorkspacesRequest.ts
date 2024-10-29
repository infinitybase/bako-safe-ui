import { WorkspaceService } from '@bako-safe/services/modules/workspace';
import { useQuery } from '@tanstack/react-query';

import { WorkspacesQueryKey } from '../utils';

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
