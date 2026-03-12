import { useQuery } from '@tanstack/react-query';

import { HomeService } from '../services';

export const CHECK_USER_BALANCES_QUERY_KEY = 'check-user-balances';

export const useCheckUserBalances = () => {
  return useQuery({
    queryKey: [CHECK_USER_BALANCES_QUERY_KEY],
    queryFn: HomeService.checkUserBalances,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 5, // 5 seconds
  });
};
