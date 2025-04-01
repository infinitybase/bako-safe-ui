import {
  IBakoSafeAuth,
  ITransferAsset,
  TransactionStatus,
  TransactionType,
  Vault,
} from 'bakosafe';
import { bn } from 'fuels';

import {
  TransactionService,
  TransactionWithVault,
} from '@/modules/transactions/services';

import { AssetMap } from '../..';
import { getAssetInfo } from '../../utils/assets/data';
import { instantiateVault } from './instantiateVault';
import { sendTransaction } from './sendTransaction';
import { useBakoSafeMutation, useBakoSafeQuery } from './utils';
import { IListTransactions, ITransaction } from './utils/types';

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
export interface IPayloadTransfer {
  assets: ITransferAsset[];
  name?: string;
  handle?: string;
  resolver?: string;
}

interface UseBakoSafeCreateTransactionParams {
  vault: Vault;
  assetsMap: AssetMap;
  onSuccess: (result: TransactionWithVault) => void;
  onError: (error: Error) => void;
}

const useBakoSafeCreateTransaction = ({
  vault,
  assetsMap,
  onSuccess,
  onError,
  ...options
}: UseBakoSafeCreateTransactionParams) => {
  return useBakoSafeMutation(
    TRANSACTION_QUERY_KEYS.DEFAULT,
    async (payload: IPayloadTransfer) => {
      try {
        const { hashTxId } = await vault.transaction({
          name: payload.name!,
          assets: payload.assets.map((asset) => {
            const { units } = getAssetInfo(assetsMap, asset.assetId);

            return {
              ...asset,
              amount: bn
                .parseUnits(asset.amount.replace(/,/g, ''), units)
                .format(),
            };
          }),
        });

        const transaction = await TransactionService.getByHash(hashTxId, [
          TransactionStatus.AWAIT_REQUIREMENTS,
        ]);

        onSuccess(transaction);
        return transaction;
      } catch (error) {
        onError(error as Error);
      }
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
  onError?: (
    transaction: BakoSafeTransactionSendVariables['transaction'],
    error: any,
  ) => void | Promise<void>;
}

interface BakoSafeTransactionSendVariables {
  transaction: Pick<
    ITransaction,
    'id' | 'predicateId' | 'predicateAddress' | 'hash'
  >;
  auth?: IBakoSafeAuth;
  providerUrl: string;
}

const useBakoSafeTransactionSend = (
  options: UseBakoSafeSendTransactionParams,
) => {
  return useBakoSafeMutation(
    TRANSACTION_QUERY_KEYS.SEND(),
    async ({ transaction, providerUrl }: BakoSafeTransactionSendVariables) => {
      const vaultInstance = await instantiateVault({
        predicateAddress: transaction.predicateAddress,
        providerUrl,
      });

      try {
        const txResult = await sendTransaction(vaultInstance, transaction.hash);

        return txResult;
      } catch (e) {
        options?.onError?.(transaction, e);
        throw e;
      }
    },
    {
      onSuccess: options.onSuccess,
    },
  );
};

export {
  useBakoSafeCreateTransaction,
  useBakoSafeTransactionList,
  useBakoSafeTransactionSend,
};
