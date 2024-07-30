import { useQuery } from '@tanstack/react-query';

import { HomeQueryKey } from '@/modules/core/models';

import { HomeService } from '../services';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const useHomeDataRequest = () => {
  const auth = useWorkspaceContext();

  return useQuery({
    queryKey: HomeQueryKey.HOME_WORKSPACE(auth.workspaces.current),
    queryFn: () => HomeService.home(),
    refetchOnWindowFocus: false,
  });
};

export { useHomeDataRequest };
