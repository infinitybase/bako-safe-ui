import { useQuery } from '@tanstack/react-query';

const useGitLoadingRequest = () => {
  const { isLoading, isFetching, refetch } = useQuery({
    queryKey: ['animation-loading'],
    queryFn: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 2880);
      }),
  });

  return {
    isLoading: isLoading || isFetching,
    refetch,
  };
};

export { useGitLoadingRequest };
