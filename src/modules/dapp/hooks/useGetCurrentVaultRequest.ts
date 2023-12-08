import { useQuery } from 'react-query';

import { DAppService } from '../services';

const useGetCurrentVaultRequest = (sessionId: string) => {
  return useQuery('transaction/details', () =>
    DAppService.findCurrentBySessionId(sessionId),
  );
};

export { useGetCurrentVaultRequest };
