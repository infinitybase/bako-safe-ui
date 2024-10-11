import { TransactionStatus, TransactionType } from 'bakosafe';
import { Address } from 'fuels';

import { IFuelTransactionNames } from '@/modules/dapp/services';

import { TransactionUI } from '../../components/TransactionCard/Details';
import { TransactionWithVault } from '../../services';

const useVerifyTransactionInformations = (
  transaction: TransactionUI | TransactionWithVault,
) => {
  const mainOperation = transaction?.summary?.operations?.[0];
  const isFromConnector = transaction.summary?.type === 'connector';
  const isDeploy = transaction.type === TransactionType.TRANSACTION_CREATE;
  const isDeposit = transaction.type === TransactionType.DEPOSIT;

  const isContract =
    transaction?.summary?.operations.some(
      (op) =>
        (op.name as unknown as IFuelTransactionNames) ===
          IFuelTransactionNames.CONTRACT_CALL || !op.assetsSent,
    ) ?? false;

  const isMint = transaction?.summary?.operations?.some((operation) => {
    const isContractCallWithAssets =
      (operation.name as unknown as IFuelTransactionNames) ===
        IFuelTransactionNames.CONTRACT_CALL && operation.assetsSent;

    const hasContractCallAndTransferAsset = [
      'CONTRACT_CALL',
      'TRANSFER_ASSET',
    ].every((name) =>
      transaction.summary?.operations.some((op) => op.name === name),
    );

    return isContractCallWithAssets || hasContractCallAndTransferAsset;
  });

  const isPending = transaction.status === TransactionStatus.AWAIT_REQUIREMENTS;

  const contractAddress = isContract
    ? Address.fromB256(mainOperation?.to?.address ?? '').toString()
    : '';

  return {
    mainOperation,
    isFromConnector,
    isDeploy,
    isDeposit,
    isContract,
    isPending,
    contractAddress,
    isMint,
  };
};

export { useVerifyTransactionInformations };
