import { useQuery } from '@tanstack/react-query';

import { HomeQueryKey } from '@/modules/core/models';

import { HomeService } from '../services';

const useHomeDataRequest = (currentWorkspace: string) => {
  return useQuery({
    queryKey: HomeQueryKey.HOME_DATA(currentWorkspace),
    queryFn: () => HomeService.home(),
    refetchOnWindowFocus: false,
    enabled: window.location.pathname != '/',
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5, // 5 minutes - socket events handle real-time updates
  });
};

export { useHomeDataRequest };
