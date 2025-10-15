import { useMutation } from '@tanstack/react-query';

import { ICreateBridgeTransactionPayload } from '@/modules/core';

import { VaultService } from '../../services';

export const useCreateBridgeTransaction = () => {
  const {
    mutateAsync: createTransactionBridgeAsync,
    mutate: createTransactionBridge,
    ...rest
  } = useMutation({
    mutationFn: async (data: ICreateBridgeTransactionPayload) =>
      VaultService.createBridgeTransaction(data),
  });

  return { createTransactionBridgeAsync, createTransactionBridge, ...rest };
};
