import {
  IListTransactions,
  ITransaction,
  TransactionWithVault,
} from '@bako-safe/services/modules/transaction';
import { sendTransaction } from '@bako-safe/wallet/transaction';
import { instantiateVault } from '@bako-safe/wallet/vault';
import { useMutation } from '@tanstack/react-query';
import {
  IBakoSafeAuth,
  ITransferAsset,
  TransactionStatus,
  Vault,
} from 'bakosafe';
import { bn } from 'fuels';

import { CookieName, CookiesConfig } from '@/config/cookies';
import { transactionService } from '@/config/services-initializer';

import { AssetMap } from '../..';
import { getAssetInfo } from '../../utils/assets/data';

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
}

interface UseBakoSafeCreateTransactionParams {
  vault: Vault;
  assetsMap: AssetMap;
  onSuccess: (result: TransactionWithVault) => void;
  onError: () => void;
}

const useBakoSafeCreateTransaction = ({
  vault,
  assetsMap,
  ...options
}: UseBakoSafeCreateTransactionParams) => {
  return useMutation({
    mutationKey: TRANSACTION_QUERY_KEYS.DEFAULT,
    mutationFn: async (payload: IPayloadTransfer) => {
      const { hashTxId } = await vault.transaction({
        name: payload.name!,
        assets: payload.assets.map((asset) => {
          const { units } = getAssetInfo(assetsMap, asset.assetId);

          return {
            ...asset,
            amount: bn.parseUnits(asset.amount, units).format(),
          };
        }),
      });
      const transaction = await transactionService.getByHash(hashTxId, [
        TransactionStatus.AWAIT_REQUIREMENTS,
      ]);
      return transaction;
    },
    ...options,
  });
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
  return useMutation({
    mutationKey: TRANSACTION_QUERY_KEYS.SEND(),
    mutationFn: async ({
      transaction,
      providerUrl,
    }: BakoSafeTransactionSendVariables) => {
      const token = CookiesConfig.getCookie(CookieName.ACCESS_TOKEN);
      const userAddress = CookiesConfig.getCookie(CookieName.ADDRESS);
      const vaultInstance = await instantiateVault({
        predicateAddress: transaction.predicateAddress,
        providerUrl,
        token,
        userAddress,
        serverApi: import.meta.env.VITE_API_URL,
      });

      try {
        await sendTransaction(vaultInstance, transaction.hash);

        const txResult = await transactionService.getByHash(transaction.hash, [
          TransactionStatus.PENDING_SENDER,
          TransactionStatus.PROCESS_ON_CHAIN,
          TransactionStatus.FAILED,
          TransactionStatus.SUCCESS,
        ]);

        return txResult;
      } catch (e) {
        options?.onError?.(transaction, e);
        throw e;
      }
    },

    onSuccess: options.onSuccess,
  });
};

export { useBakoSafeCreateTransaction, useBakoSafeTransactionSend };
