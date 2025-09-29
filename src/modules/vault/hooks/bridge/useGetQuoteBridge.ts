import { useMutation } from '@tanstack/react-query';

import { ICreateSwapBridgePayload } from '@/modules/core';

import { VaultService } from '../../services';

export const useGetQuoteBridge = () => {
  const {
    mutateAsync: getQuoteBridgeAsync,
    mutate: getQuoteBridge,
    ...rest
  } = useMutation({
    mutationFn: async (data: ICreateSwapBridgePayload) => {
      return VaultService.getQuoteBridge(data);
    },
  });

  return { getQuoteBridgeAsync, getQuoteBridge, ...rest };
};
