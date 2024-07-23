import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/modules/auth/hooks';
import { HomeQueryKey } from '@/modules/core/models';

import { HomeService } from '../services';

const useHomeDataRequest = () => {
  const auth = useAuth();

  return useQuery({
    queryKey: HomeQueryKey.HOME_WORKSPACE(auth.workspaces.current),
    queryFn: () => HomeService.home(),
    refetchOnWindowFocus: false,
  });
};

export { useHomeDataRequest };
