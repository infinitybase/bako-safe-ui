import { ITransferAsset } from 'bakosafe';
import { bn } from 'fuels';

import { isHex } from '@/utils';

import { OperationWithAssets, TransactionWithVault } from '../services';

interface UseGetAssetsByOperationsResult {
  operationAssets: ITransferAsset;
  sentBy: string;
  hasNoDefaultAssets: boolean;
}

const useGetAssetsByOperations = (
  transaction: TransactionWithVault,
): UseGetAssetsByOperationsResult => {
  const hasNoDefaultAssets = !transaction?.assets?.length;
  const defaultSentBy = transaction?.txData?.inputs[0]?.['owner'] ?? '';

  if (!transaction?.summary?.operations?.length) {
    return {
      operationAssets: {
        amount: '',
        assetId: '',
        to: '',
      },
      sentBy: defaultSentBy,

      hasNoDefaultAssets,
    };
  }
  const firstOperation = transaction.summary
    ?.operations[0] as OperationWithAssets;

  if (!firstOperation.assetsSent) {
    const { amount, assetId, to, from } = firstOperation;

    const stringfiedAmount = amount ?? '';

    const assetAmount = isHex(stringfiedAmount)
      ? bn(stringfiedAmount).format()
      : stringfiedAmount;

    const operationAssets = {
      amount: assetAmount ?? '',
      assetId: assetId ?? '',
      to: to?.address ?? '',
    };

    const sentBy = from?.address ?? '';

    return {
      operationAssets,
      sentBy,
      hasNoDefaultAssets,
    };
  }

  const { assetsSent = [], to, from } = firstOperation;

  const amount = String(assetsSent[0]?.amount ?? '');

  const assetAmount = isHex(amount) ? bn(amount).format() : amount;

  const operationAssets = {
    amount: assetAmount ?? '',
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
