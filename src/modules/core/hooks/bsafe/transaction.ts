import { IPayloadTransfer, Vault } from 'bsafe';

import { useBsafeMutation } from './utils';

const TRANSACTION_QUERY_KEYS = {
  DEFAULT: ['bsafe', 'transaction'],
  VAULT: (id: string) => [...TRANSACTION_QUERY_KEYS.DEFAULT, id],
};

interface UseCreateBsafeTransactionParams {
  vault: Vault;
  onSuccess: () => void;
  onError: () => void;
}

const useBsafeCreateTransaction = ({
  vault,
  ...options
}: UseCreateBsafeTransactionParams) => {
  return useBsafeMutation(
    TRANSACTION_QUERY_KEYS.DEFAULT,
    async (payload: IPayloadTransfer) => {
      return vault?.BSAFEIncludeTransaction(payload);
    },
    options,
  );
};

export { useBsafeCreateTransaction };
