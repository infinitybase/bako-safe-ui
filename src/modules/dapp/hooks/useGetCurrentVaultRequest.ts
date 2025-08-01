import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';

import { DAppService } from '../services';

const useGetCurrentVaultRequest = (sessionId: string) => {
  const isValid = !window.location.pathname.includes(`/dapp/transaction`);
  return useQuery({
    queryKey: ['transaction/details'],
    queryFn: () => DAppService.findCurrentBySessionId(sessionId),
    enabled: isValid,
  });
};

const useGetCurrentVaultInDappTxRequest = (
  options?: UseMutationOptions<string, unknown, string>,
) => {
  return useMutation({
    mutationKey: ['current/vault/dapp'],
    mutationFn: DAppService.findCurrentBySessionId,
    ...options,
  });
};

export { useGetCurrentVaultInDappTxRequest, useGetCurrentVaultRequest };
