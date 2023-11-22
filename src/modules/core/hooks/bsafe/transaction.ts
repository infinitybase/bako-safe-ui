import {
  IBSAFEAuth,
  IListTransactions,
  IPayloadTransfer,
  ITransaction,
  Vault,
} from 'bsafe';

import { useBsafeMutation, useBsafeQuery } from './utils';

const TRANSACTION_QUERY_KEYS = {
  DEFAULT: ['bsafe', 'transaction'],
  SEND: () => [...TRANSACTION_QUERY_KEYS.DEFAULT, 'send'],
  VAULT: (id: string, filter?: IListTransactions) => [
    ...TRANSACTION_QUERY_KEYS.DEFAULT,
    'vault',
    id,
    filter,
  ],
};

interface UseBsafeCreateTransactionParams {
  vault: Vault;
  onSuccess: () => void;
  onError: () => void;
}

const useBsafeCreateTransaction = ({
  vault,
  ...options
}: UseBsafeCreateTransactionParams) => {
  return useBsafeMutation(
    TRANSACTION_QUERY_KEYS.DEFAULT,
    async (payload: IPayloadTransfer) => {
      return vault?.BSAFEIncludeTransaction({
        name: payload.name!,
        witnesses: payload.witnesses,
        assets: payload.assets,
      });
    },
    options,
  );
};

interface UseBsafeListTransactionParams {
  vault: Vault;
  filter?: IListTransactions;
}

const useBsafeTransactionList = ({
  vault,
  filter,
}: UseBsafeListTransactionParams) => {
  return useBsafeQuery(
    TRANSACTION_QUERY_KEYS.VAULT(vault?.BSAFEVaultId, filter),
    async () => {
      const transactions = await vault.BSAFEGetTransactions(filter);
      return transactions;
    },
    { enabled: !!vault },
  );
};

interface UseBsafeSendTransactionParams {
  onSuccess: (transaction: ITransaction) => void;
  onError: (error: any) => void;
}

interface BSAFETransactionSendVariables {
  /* TODO: Send a transfer here */
  transaction: ITransaction;
  auth?: IBSAFEAuth;
}

const useBsafeTransactionSend = (options: UseBsafeSendTransactionParams) => {
  return useBsafeMutation(
    TRANSACTION_QUERY_KEYS.SEND(),
    async ({ transaction, auth }: BSAFETransactionSendVariables) => {
      console.log(transaction);
      const vault = await Vault.create({
        id: transaction.predicateId,
        token: auth!.token,
        address: auth!.address,
      });
      const transfer = await vault.BSAFEGetTransaction(transaction.id);
      console.log(transfer);
      console.log(await transfer.send());
      await transfer.wait();
      return transfer.BSAFETransaction;
    },
    {
      onSuccess: options.onSuccess,
      onError: options.onError,
    },
  );
};

export {
  useBsafeCreateTransaction,
  useBsafeTransactionList,
  useBsafeTransactionSend,
};
