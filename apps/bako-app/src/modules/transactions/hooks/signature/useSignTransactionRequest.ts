import type {
  SignerTransactionPayload,
  SignerTransactionResponse,
} from '@bako-safe/services';
import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { transactionService } from '@/config/services-initializer';

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
