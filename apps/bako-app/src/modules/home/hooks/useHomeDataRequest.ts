import { useQuery } from '@tanstack/react-query';

import { homeService } from '@/modules/services/services-initializer';

import { HomeQueryKey } from '../utils';

const useHomeDataRequest = (currentWorkspace: string) => {
  return useQuery({
    queryKey: HomeQueryKey.HOME_WORKSPACE(currentWorkspace),
    queryFn: () => homeService.home(),
    refetchOnWindowFocus: false,
    enabled: window.location.pathname != '/',
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });
};

export { useHomeDataRequest };
