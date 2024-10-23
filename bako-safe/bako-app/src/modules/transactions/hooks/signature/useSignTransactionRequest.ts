import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  SignerTransactionPayload,
  SignerTransactionResponse,
  TransactionService,
} from '@/modules/transactions/services';

const useSignTransactionRequest = (
  options?: UseMutationOptions<
    SignerTransactionResponse,
    unknown,
    SignerTransactionPayload
  >,
) => {
  return useMutation({
    mutationKey: ['transaction/sign'],
    mutationFn: TransactionService.signer,
    ...options,
  });
};

export { useSignTransactionRequest };
