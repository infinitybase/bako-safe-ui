// import type { IListTransactions } from '@bako-safe/se';
import { useMutation } from '@tanstack/react-query';
import type { ITransferAsset, Vault } from 'bakosafe';

export const TRANSACTION_QUERY_KEYS = {
  DEFAULT: ['bakosafe', 'transaction'],
  SEND: () => [...TRANSACTION_QUERY_KEYS.DEFAULT, 'send'],
  VAULT: (id: string, filter?: any) => [
    ...TRANSACTION_QUERY_KEYS.DEFAULT,
    'vault',
    id,
    filter,
  ],
};
export interface IPayloadTransfer {
  assets: ITransferAsset[];
  name: string;
}

interface UseBakoSafeCreateTransactionParams {
  vault: Vault;
  onSuccess: (hashTxId: string) => Promise<void>;
  onError: () => void;
}

const useBakoSafeCreateTransaction = ({
  vault,
  ...options
}: UseBakoSafeCreateTransactionParams) => {
  return useMutation({
    mutationKey: TRANSACTION_QUERY_KEYS.DEFAULT,
    mutationFn: async (payload: IPayloadTransfer) => {
      const { hashTxId } = await vault.transaction({
        name: payload.name,
        assets: payload.assets,
      });
      return hashTxId;
    },
    ...options,
  });
};

export { useBakoSafeCreateTransaction };
