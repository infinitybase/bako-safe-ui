import {
  IBakoSafeAuth,
  ITransferAsset,
  TransactionType,
  Vault,
} from 'bakosafe';
import { bn } from 'fuels';

import {
  TransactionService,
  TransactionWithVault,
} from '@/modules/transactions/services';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

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
}

interface UseBakoSafeCreateTransactionParams {
  vault: Vault;
  onSuccess: (result: TransactionWithVault) => void;
  onError: () => void;
}

const useBakoSafeCreateTransaction = ({
  vault,
  ...options
}: UseBakoSafeCreateTransactionParams) => {
  const { assetsMap } = useWorkspaceContext();

  return useBakoSafeMutation(
    TRANSACTION_QUERY_KEYS.DEFAULT,
    async (payload: IPayloadTransfer) => {
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
      const transaction = await TransactionService.getByHash(hashTxId);
      return transaction;
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
