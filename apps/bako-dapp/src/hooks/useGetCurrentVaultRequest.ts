import { useQuery } from '@tanstack/react-query';

import { dappService } from '@/service/service-initializer';

const useGetCurrentVaultRequest = (sessionId: string) => {
  const isValid = !window.location.pathname.includes(`/dapp/transaction`);
  return useQuery({
    queryKey: ['transaction/details'],
    queryFn: () => dappService.findCurrentBySessionId(sessionId),
    enabled: isValid,
  });
};

export { useGetCurrentVaultRequest };
