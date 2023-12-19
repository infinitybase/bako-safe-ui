import { useMutation, UseMutationOptions } from 'react-query';

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
  return useMutation('transaction/sign', TransactionService.signer, options);
};

export { useSignTransactionRequest };
