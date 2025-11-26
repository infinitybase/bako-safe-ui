import {
  IBakoSafeAuth,
  ITransferAsset,
  TransactionStatus,
  TransactionType,
  Vault,
} from 'bakosafe';
import { bn } from 'fuels';

import { getAssetInfo } from '@/modules/assets-tokens/hooks/useAssetMap';
import {
  TransactionService,
  TransactionWithVault,
} from '@/modules/transactions/services';

import { AssetMap } from '../..';
import { jamMonitor } from '../../services/jamMonitor';
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
  onSuccess,
  onError,
  ...options
}: UseBakoSafeCreateTransactionParams) => {
  return useBakoSafeMutation(
    TRANSACTION_QUERY_KEYS.DEFAULT,
    async (payload: IPayloadTransfer) => {
      const timer = jamMonitor.startTimer();

      // Log transaction creation start
      jamMonitor.txCreateStart({
        transactionName: payload.name,
        predicateAddress: vault?.address?.toString(),
        assets: payload.assets.map((asset) => ({
          assetId: asset.assetId,
          amount: asset.amount,
          to: asset.to,
        })),
      });

      try {
        const { hashTxId } = await vault.transaction({
          name: payload.name!,
          assets: payload.assets.map((asset) => {
            const info = getAssetInfo(asset.assetId);
            const units = info?.units ?? info?.decimals ?? 9;

            return {
              ...asset,
              amount: bn
                .parseUnits(
                  asset.amount.replace(/,/g, ''),
                  info.isNFT ? undefined : units,
                )
                .format(),
            };
          }),
        });

        const transaction = await TransactionService.getByHash(hashTxId, [
          TransactionStatus.AWAIT_REQUIREMENTS,
        ]);

        // Log transaction creation success
        jamMonitor.txCreateSuccess({
          transactionId: transaction.id,
          transactionHash: transaction.hash,
          transactionName: transaction.name,
          predicateId: transaction.predicateId,
          status: transaction.status,
          duration: timer(),
        });

        return transaction;
      } catch (error) {
        // Log transaction creation error
        jamMonitor.txCreateError({
          transactionName: payload.name,
          predicateAddress: vault?.address?.toString(),
          assets: payload.assets.map((asset) => ({
            assetId: asset.assetId,
            amount: asset.amount,
            to: asset.to,
          })),
          error: {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          },
        });
        throw error;
      }
    },
    {
      onSuccess,
      onError,
      ...options,
    },
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
      const timer = jamMonitor.startTimer();

      // Log transaction send start
      jamMonitor.txSendStart({
        transactionId: transaction.id,
        transactionHash: transaction.hash,
        predicateId: transaction.predicateId,
        predicateAddress: transaction.predicateAddress,
      });

      try {
        const vaultInstance = await instantiateVault({
          predicateAddress: transaction.predicateAddress,
          providerUrl,
        });

        const txResult = await sendTransaction(vaultInstance, transaction.hash);

        // Log transaction send success
        jamMonitor.txSendSuccess({
          transactionId: txResult.id,
          transactionHash: txResult.hash,
          status: txResult.status,
          gasUsed: txResult.gasUsed,
          duration: timer(),
        });

        return txResult;
      } catch (e) {
        // Log transaction send error
        jamMonitor.txSendError({
          transactionId: transaction.id,
          transactionHash: transaction.hash,
          predicateId: transaction.predicateId,
          error: {
            message: e instanceof Error ? e.message : String(e),
            stack: e instanceof Error ? e.stack : undefined,
          },
        });

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
