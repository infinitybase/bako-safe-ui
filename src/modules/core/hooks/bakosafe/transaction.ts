import {
  IListTransactions,
  IPayloadTransfer,
  ITransaction,
  Vault,
  TransactionType,
} from 'bakosafe';

import { TransactionService } from '@/modules/transactions/services';

import { useBakoSafeMutation, useBakoSafeQuery } from './utils';
import { CookieName, CookiesConfig } from '@/config/cookies';

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
    byMonth?: boolean;
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
  onError: (error: any) => void;
  predicateId: string;
  transactionId: string;
}

// Receber predicateId e txID
//  Ao confirmar (ao término do .wait) e invalidar as transações
//  no onSuccess invalidar a request de tx (da página específica onde ocorre a assinatura)

const useBakoSafeTransactionSend = (
  options: UseBakoSafeSendTransactionParams,
) => {
  return useBakoSafeMutation(
    TRANSACTION_QUERY_KEYS.SEND(),
    // @ts-ignore
    async (predicateId: string, transactionId: string) => {
      const vault = await Vault.create({
        id: predicateId,
        token: CookiesConfig.getCookie(CookieName.ACCESS_TOKEN),
        address: CookiesConfig.getCookie(CookieName.ADDRESS),
      });

      const transfer = await vault.BakoSafeGetTransaction(transactionId);

      await transfer.wait();

      return (await vault.BakoSafeGetTransaction(transactionId))
        .BakoSafeTransaction;
    },
    {
      onSuccess: options.onSuccess,
      onError: options.onError,
    },
  );
};

export {
  useBakoSafeCreateTransaction,
  useBakoSafeTransactionList,
  useBakoSafeTransactionSend,
};
