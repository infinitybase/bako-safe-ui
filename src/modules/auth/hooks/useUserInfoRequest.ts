import { useQuery } from '@tanstack/react-query';

import { UserService } from '../services';
export const LATEST_INFO_QUERY_KEY = ['latest-info'];

const useUserInfoRequest = () => {
  const { data, ...query } = useQuery({
    queryKey: LATEST_INFO_QUERY_KEY,
    queryFn: UserService.getUserInfos,
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
