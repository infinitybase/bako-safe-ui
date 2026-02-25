import { useQuery } from '@tanstack/react-query';

import { DAppService } from '../services';

const useGetCurrentVaultRequest = (sessionId: string) => {
  const isValid = !window.location.pathname.includes(`/dapp/transaction`);
  return useQuery({
    queryKey: ['transaction/details'],
    queryFn: () => DAppService.findCurrentBySessionId(sessionId),
    enabled: isValid,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export { useGetCurrentVaultRequest };
