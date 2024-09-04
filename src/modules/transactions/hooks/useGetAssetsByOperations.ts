import { ITransferAsset } from 'bakosafe';
import { bn } from 'fuels';

import { TransactionWithVault } from '../services';

interface UseGetAssetsByOperationsResult {
  operationAssets: ITransferAsset;
  sentBy: string;
  hasNoDefaultAssets: boolean;
}

const useGetAssetsByOperations = (
  transaction: TransactionWithVault,
): UseGetAssetsByOperationsResult => {
  const hasNoDefaultAssets = !transaction?.assets?.length;

  if (!transaction?.summary?.operations?.length) {
    return {
      operationAssets: { amount: '', assetId: '', to: '' },
      sentBy: '',
      hasNoDefaultAssets,
    };
  }

  // this [firstOperation] it's the same as const firstOperation = transaction.summary?.operations[0]
  const {
    operations: [firstOperation],
  } = transaction.summary;
  const { assetsSent = [], to, from } = firstOperation;

  const operationAssets = {
    amount: bn(assetsSent[0]?.amount ?? '').format() ?? '',
    assetId: assetsSent[0]?.assetId ?? '',
    to: to?.address ?? '',
  };

  const sentBy = from?.address ?? '';

  return {
    operationAssets,
    sentBy,
    hasNoDefaultAssets,
  };
};

export { useGetAssetsByOperations };
