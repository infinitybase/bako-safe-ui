import { dappService } from '@app/config/services-initializer';
import { useQuery } from '@tanstack/react-query';

const useGetCurrentVaultRequest = (sessionId: string) => {
  const isValid = !window.location.pathname.includes(`/dapp/transaction`);
  return useQuery({
    queryKey: ['transaction/details'],
    queryFn: () => dappService.findCurrentBySessionId(sessionId),
    enabled: isValid,
  });
};

export { useGetCurrentVaultRequest };
