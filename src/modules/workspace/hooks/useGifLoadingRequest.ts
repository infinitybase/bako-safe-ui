import { useQuery } from '@tanstack/react-query';

export enum GifLoadingRequestQueryKey {
  ANIMATION_LOADING = 'animation-loading',
}

const useGitLoadingRequest = () => {
  const { isLoading, isFetching, refetch } = useQuery({
    queryKey: [GifLoadingRequestQueryKey.ANIMATION_LOADING],
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
