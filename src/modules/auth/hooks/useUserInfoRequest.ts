import { UserService } from '../services';
import { useQuery } from '@tanstack/react-query';
export const LATEST_INFO_QUERY_KEY = ['latest-info'];

const useUserInfoRequest = () => {
  const { data, ...query } = useQuery({
    queryKey: LATEST_INFO_QUERY_KEY,
    queryFn: UserService.getUserInfos,
  });

  return {
    infos: data,
    ...query,
  };
};

export { useUserInfoRequest };
