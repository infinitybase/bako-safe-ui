import { useQuery } from '@tanstack/react-query';

export enum LogoutRequestQueryKey {
  LOGOUT = 'logout',
}

const useLogout = (onSuccess: () => void) => {
  const { isLoading, isFetching, refetch } = useQuery({
    queryKey: [LogoutRequestQueryKey.LOGOUT],
    queryFn: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
          onSuccess();
        }, 2880);
      }),
    enabled: false,
  });

  const logout = () => {
    refetch();
  };

  return {
    isLoading: isLoading || isFetching,
    logout,
  };
};

export { useLogout };
