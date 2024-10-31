import { useQuery } from '@tanstack/react-query';

import { userService } from '@/config/services-initializer';

export const LATEST_INFO_QUERY_KEY = ['latest-info'];

const useUserInfoRequest = () => {
  const { data, ...query } = useQuery({
    queryKey: LATEST_INFO_QUERY_KEY,
    queryFn: userService.getUserInfos,
    enabled: window.location.pathname != '/',
    refetchOnMount: false,
    staleTime: 500,
  });

  return {
    infos: data,
    ...query,
  };
};

export { useUserInfoRequest };
