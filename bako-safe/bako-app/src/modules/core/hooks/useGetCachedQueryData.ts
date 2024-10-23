import { queryClient } from '@/config';

const useGetCachedQueryData = (queryKey: string[]) => {
  const cachedData = queryClient.getQueryState(queryKey);

  return {
    cachedData,
  };
};

export { useGetCachedQueryData };
