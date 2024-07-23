import { useQuery } from '@tanstack/react-query';

import { DAppService } from '../services';

const useGetCurrentVaultRequest = (sessionId: string) => {
  return useQuery({
    queryKey: ['transaction/details'],
    queryFn: () => DAppService.findCurrentBySessionId(sessionId),
  });
};

export { useGetCurrentVaultRequest };
