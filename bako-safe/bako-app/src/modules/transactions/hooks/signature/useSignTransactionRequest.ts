import {
  SignerTransactionPayload,
  SignerTransactionResponse,
  TransactionService,
} from '@services/modules/transaction';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

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
