import { useQuery } from '@tanstack/react-query';
import { UserService } from '../services';

const USER_ME_QUERY_KEY = 'user-me-info';

const useUserInfo = () => {
  const { data, ...query } = useQuery({
    queryKey: [USER_ME_QUERY_KEY],
    queryFn: UserService.getUserInfo,
  });

  return {
    userInfos: data,
    ...query,
  };
};

export { useUserInfo };
