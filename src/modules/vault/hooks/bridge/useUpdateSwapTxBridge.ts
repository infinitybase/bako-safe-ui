import { useMutation } from '@tanstack/react-query';

import { IUpdateSwapBridgeTxPayload } from '@/modules/core';

import { VaultService } from '../../services';

export const useUpdateSwapTxBridge = () => {
  const {
    mutateAsync: updateSwapBridgeAsync,
    mutate: updateSwapBridge,
    ...rest
  } = useMutation({
    mutationFn: async (data: IUpdateSwapBridgeTxPayload) =>
      VaultService.updateSwapBridgeTransaction(data),
  });

  return { updateSwapBridgeAsync, updateSwapBridge, ...rest };
};
