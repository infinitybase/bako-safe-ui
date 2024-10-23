import {
  OperationWithAssets,
  TransactionWithVault,
} from '@services/modules/transaction';
import { ITransferAsset } from 'bakosafe';

import { useFormatSummaryAssets } from './useFormatSummaryAssets';

interface UseGetAssetsByOperationsResult {
  operationAssets: ITransferAsset;
  sentBy: string;
  hasNoDefaultAssets: boolean;
}

const useGetAssetsByOperations = (
  transaction: TransactionWithVault,
  predicateAddress?: string,
): UseGetAssetsByOperationsResult => {
  const hasNoDefaultAssets = !transaction?.assets?.length;
  const defaultSentBy = transaction?.txData?.inputs[0]?.['owner'] ?? '';

  const firstOperation = transaction.summary
    ?.operations[0] as OperationWithAssets;
  const _from = firstOperation?.from?.address ?? '';
  const sentBy = !transaction?.summary?.operations?.length
    ? defaultSentBy
    : _from;

  const { amount, assetId, to } = useFormatSummaryAssets({
    operations: transaction.summary?.operations,
    txData: transaction.txData,
    chainId: transaction.network.chainId,
    predicateAddress,
  });

  return {
    operationAssets: {
      amount,
      assetId,
      to,
    },
    sentBy,
    hasNoDefaultAssets,
  };
};

export { useGetAssetsByOperations };
