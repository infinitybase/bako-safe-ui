import { useQuery } from '@tanstack/react-query';

import { HomeService } from '../services';

export const useUserAllocationRequest = () => {
  const { data, ...rest } = useQuery({
    queryKey: ['user-allocation'],
    queryFn: HomeService.getUserAllocation,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes - socket events handle real-time updates
  });

  return { allocation: data, ...rest };
};
