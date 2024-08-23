import {
  IListTransactions,
  IPayloadTransfer,
  ITransaction,
  Vault,
  TransactionType,
  IBakoSafeAuth,
} from 'bakosafe';

import { TransactionService } from '@/modules/transactions/services';

import { useBakoSafeMutation, useBakoSafeQuery } from './utils';

export const TRANSACTION_QUERY_KEYS = {
  DEFAULT: ['bakosafe', 'transaction'],
  SEND: () => [...TRANSACTION_QUERY_KEYS.DEFAULT, 'send'],
  VAULT: (id: string, filter?: IListTransactions) => [
    ...TRANSACTION_QUERY_KEYS.DEFAULT,
    'vault',
    id,
    filter,
  ],
};

interface UseBakoSafeCreateTransactionParams {
  vault: Vault;
  onSuccess: () => void;
  onError: () => void;
}

const useBakoSafeCreateTransaction = ({
  vault,
  ...options
}: UseBakoSafeCreateTransactionParams) => {
  return useBakoSafeMutation(
    TRANSACTION_QUERY_KEYS.DEFAULT,
    async (payload: IPayloadTransfer) => {
      return vault?.BakoSafeIncludeTransaction({
        name: payload.name!,
        witnesses: payload.witnesses,
        assets: payload.assets,
      });
    },
    options,
  );
};

interface UseBakoSafeListTransactionParams {
  vaultId: string;
  filter?: IListTransactions & {
    limit: number;
    type?: TransactionType;
  };
}

const useBakoSafeTransactionList = ({
  vaultId,
  filter,
}: UseBakoSafeListTransactionParams) => {
  return useBakoSafeQuery(
    TRANSACTION_QUERY_KEYS.VAULT(vaultId, filter),
    async () => {
      return await TransactionService.getTransactionsPagination({
        predicateId: [vaultId],
        ...filter,
      });
    },
    { enabled: !!vaultId, refetchOnWindowFocus: false },
  );
};

interface UseBakoSafeSendTransactionParams {
  onSuccess: (transaction: ITransaction) => void;
  onError?: (error: any) => void;
}

interface BakoSafeTransactionSendVariables {
  transaction: Pick<ITransaction, 'id' | 'predicateId'>;
  auth?: IBakoSafeAuth;
}

const useBakoSafeTransactionSend = (
  options: UseBakoSafeSendTransactionParams,
) => {
  return useBakoSafeMutation(
    TRANSACTION_QUERY_KEYS.SEND(),
    async ({ transaction, auth }: BakoSafeTransactionSendVariables) => {
      const vault = await Vault.create({
        id: transaction.predicateId,
        token: auth!.token,
        address: auth!.address,
      });

      const transfer = await vault.BakoSafeGetTransaction(transaction.id!);

      await transfer.wait();

      return transfer.BakoSafeTransaction;
    },
    {
      onSuccess: options.onSuccess,
      onError: options?.onError,
    },
  );
};

export {
  useBakoSafeCreateTransaction,
  useBakoSafeTransactionList,
  useBakoSafeTransactionSend,
};
