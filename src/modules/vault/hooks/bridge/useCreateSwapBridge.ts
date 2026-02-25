import { useMutation } from '@tanstack/react-query';

import { ICreateSwapBridgePayload } from '@/modules/core';

import { VaultService } from '../../services';

export const useCreateSwapBridge = () => {
  const {
    mutateAsync: createSwapBridgeAsync,
    mutate: createSwapBridge,
    ...rest
  } = useMutation({
    mutationFn: async (data: ICreateSwapBridgePayload) =>
      VaultService.createSwapBridge(data),
  });

  return { createSwapBridgeAsync, createSwapBridge, ...rest };
};
