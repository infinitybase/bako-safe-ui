import { useQuery } from '@tanstack/react-query';

import { HomeService } from '../services';

export const useUserAllocationRequest = () => {
  const { data, ...rest } = useQuery({
    queryKey: ['user-allocation'],
    queryFn: HomeService.getUserAllocation,
    refetchOnWindowFocus: true,
    staleTime: 60 * 1000, // 1 minute
  });

  return { allocation: data, ...rest };
};
