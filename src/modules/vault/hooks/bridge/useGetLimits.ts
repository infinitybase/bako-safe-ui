import { useMutation } from '@tanstack/react-query';

import { ICreateSwapBridgePayload } from '@/modules/core';

import { VaultService } from '../../services';

export const useGetLimitsBridge = () => {
  const {
    mutateAsync: getLimitsBridgeAsync,
    mutate: getLimitsBridge,
    ...rest
  } = useMutation({
    mutationFn: async (data: ICreateSwapBridgePayload) => {
      return VaultService.getLimitsBridge(data);
    },
  });

  return { getLimitsBridgeAsync, getLimitsBridge, ...rest };
};
