import { useQuery } from 'react-query';

import { useAuth } from '@/modules/auth/hooks';
import { HomeQueryKey } from '@/modules/core/models';

import { HomeService } from '../services';

const useHomeDataRequest = () => {
  const auth = useAuth();

  return useQuery(
    HomeQueryKey.HOME_WORKSPACE(auth.workspaces.current),
    () => HomeService.home(),
    {
      refetchOnWindowFocus: true,
      //refetchInterval: 10000,
    },
  );
};

export { useHomeDataRequest };
