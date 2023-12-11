import {
  Asset,
  IBSAFEAuth,
  IListTransactions,
  IPayloadTransfer,
  ITransaction,
  ITransferAsset,
  Vault,
} from 'bsafe';
import { bn } from 'fuels';

import { TransactionService } from '@/modules/transactions/services';

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
      return await TransactionService.getTransactions({
        predicateId: [vault?.BSAFEVaultId],
        ...filter,
      });
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

const validateBalance = async (
  vault: Vault,
  _coins: ITransferAsset[],
  id: string,
) => {
  const balances = await vault.getBalances();
  const coins = await Asset.assetsGroupById(
    balances.map((item) => {
      return {
        assetId: item.assetId,
        amount: item.amount.format(),
        to: '',
      };
    }),
  );

  const _coinsTransaction = await Asset.assetsGroupById(_coins);

  Object.entries(_coinsTransaction).map(([key, value]) => {
    if (bn(coins[key]).lt(value)) {
      throw new Error(`Insufficient balance for ${key}:${id}`);
    }
  });
};

const useBsafeTransactionSend = (options: UseBsafeSendTransactionParams) => {
  return useBsafeMutation(
    TRANSACTION_QUERY_KEYS.SEND(),
    async ({ transaction, auth }: BSAFETransactionSendVariables) => {
      const vault = await Vault.create({
        id: transaction.predicateId,
        token: auth!.token,
        address: auth!.address,
      });

      await validateBalance(vault, transaction.assets, transaction.id);

      const transfer = await vault.BSAFEGetTransaction(transaction.id);
      await transfer.send();
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
