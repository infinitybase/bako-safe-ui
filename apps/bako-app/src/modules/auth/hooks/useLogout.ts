import { useQuery } from '@tanstack/react-query';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

export enum LogoutRequestQueryKey {
  LOGOUT = 'logout',
}

const useLogout = (onSuccess: () => void) => {
  const { invalidateGifAnimationRequest } = useWorkspaceContext();

  const { isLoading, isFetching, refetch } = useQuery({
    queryKey: [LogoutRequestQueryKey.LOGOUT],
    queryFn: () =>
      new Promise((resolve) => {
        invalidateGifAnimationRequest();
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
