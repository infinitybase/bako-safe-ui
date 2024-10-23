import { useQuery } from '@tanstack/react-query';

import { HomeQueryKey } from '@/modules/core/models';

import { HomeService } from '../services';

const useHomeDataRequest = (currentWorkspace: string) => {
  return useQuery({
    queryKey: HomeQueryKey.HOME_WORKSPACE(currentWorkspace),
    queryFn: () => HomeService.home(),
    refetchOnWindowFocus: false,
    enabled: window.location.pathname != '/',
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });
};

export { useHomeDataRequest };
