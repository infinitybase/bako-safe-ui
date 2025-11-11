import { ITransferAsset } from 'bakosafe';
import { Operation, TransactionRequest } from 'fuels';

import { useWorkspaceContext } from '@/modules/workspace/hooks';
import { formatAssetAmount, isHex } from '@/utils';

import { OperationWithAssets } from '../../services/types';

const { VITE_CHAIN_ID } = import.meta.env;

interface UseFormatSummaryAssetsParams {
  operations?: Operation[];
  predicateAddress?: string;
  txData?: TransactionRequest;
  chainId?: number;
}

const useFormatSummaryAssets = (
  params: UseFormatSummaryAssetsParams,
): ITransferAsset => {
  const {
    operations,
    predicateAddress,
    txData,
    chainId = Number(VITE_CHAIN_ID),
  } = params;

  const { fuelsTokens } = useWorkspaceContext();

  const txDataInput = txData?.inputs.find((input) => input.type === 0);

  if (!operations?.length) {
    return {
      amount: '',
      assetId: '',
      to: '',
    };
  }

  const filterOperationsToVault = () => {
    const operationsToVault = operations.filter(
      (op) => op.assetsSent && op.to?.address === predicateAddress,
    );

    return operationsToVault.length ? operationsToVault : operations;
  };

  const _operations = predicateAddress ? filterOperationsToVault() : operations;

  const firstOperation = _operations[0] as OperationWithAssets;

  if (!firstOperation) {
    return {
      amount: '',
      assetId: '',
      to: '',
    };
  }

  if (!firstOperation.assetsSent) {
    const { amount, assetId, to } = firstOperation;
    if (
      (!amount || !assetId) &&
      txDataInput?.['assetId'] &&
      txDataInput?.['amount']
    ) {
      const assetId = (txDataInput?.['assetId'] ?? '') as string;
      const stringfiedAmount = String(txDataInput?.['amount']);

      let assetAmount = stringfiedAmount;

      if (isHex(stringfiedAmount)) {
        assetAmount = formatAssetAmount({
          fuelsTokens,
          chainId,
          assetId,
          amount: stringfiedAmount,
        });
      }

      return {
        amount: assetAmount ?? '',
        assetId,
        to: to?.address ?? '',
      };
    }

    const _assetId = assetId ?? '';
    const stringfiedAmount = amount ?? '';

    let assetAmount = stringfiedAmount;

    if (isHex(stringfiedAmount)) {
      assetAmount = formatAssetAmount({
        fuelsTokens,
        chainId,
        assetId: _assetId,
        amount: stringfiedAmount,
      });
    }

    return {
      amount: assetAmount ?? '',
      assetId: _assetId,
      to: to?.address ?? '',
    };
  }

  const { assetsSent = [], to } = firstOperation;

  const assetId = assetsSent[0]?.assetId ?? '';
  const amount = String(assetsSent[0]?.amount ?? '');

  let assetAmount = amount;

  if (isHex(amount)) {
    assetAmount = formatAssetAmount({
      fuelsTokens,
      chainId,
      assetId,
      amount,
    });
  }

  return {
    amount: assetAmount ?? '',
    assetId,
    to: to?.address ?? '',
  };
};

export { useFormatSummaryAssets };
