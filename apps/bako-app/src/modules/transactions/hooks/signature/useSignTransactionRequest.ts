import {
  SignerTransactionPayload,
  SignerTransactionResponse,
} from '@bako-safe/services/modules/transaction';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { transactionService } from '@/modules/services/services-initializer';

const useSignTransactionRequest = (
  options?: UseMutationOptions<
    SignerTransactionResponse,
    unknown,
    SignerTransactionPayload
  >,
) => {
  return useMutation({
    mutationKey: ['transaction/sign'],
    mutationFn: transactionService.signer,
    ...options,
  });
};

export { useSignTransactionRequest };
