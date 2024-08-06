import { useQuery } from '@tanstack/react-query';

import { HomeQueryKey } from '@/modules/core/models';

import { HomeService } from '../services';
import { CookieName, CookiesConfig } from '@/config/cookies';

const useHomeDataRequest = (currentWorkspace: string) => {
  return useQuery({
    queryKey: HomeQueryKey.HOME_WORKSPACE(currentWorkspace),
    queryFn: () => HomeService.home(),
    refetchOnWindowFocus: false,
    enabled: !!CookiesConfig.getCookie(CookieName.ACCESS_TOKEN),
  });
};

export { useHomeDataRequest };
