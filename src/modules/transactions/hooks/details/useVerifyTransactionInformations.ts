import { TransactionStatus, TransactionType } from 'bakosafe';
import { Address } from 'fuels';

import { IFuelTransactionNames } from '@/modules/dapp/services';

import { TransactionUI } from '../../components/TransactionCard/Details';
import { TransactionWithVault } from '../../services';

const useVerifyTransactionInformations = (
  transaction: TransactionUI | TransactionWithVault,
) => {
  const mainOperation = transaction?.summary?.operations?.[0];
  mainOperation?.to?.address;
  const transferAssetsOperations = transaction.summary?.operations.filter(
    (operation) =>
      (operation.name as unknown as IFuelTransactionNames) ===
      IFuelTransactionNames.TRANSFER_ASSET,
  );

  const isFromConnector = transaction.summary?.type === 'connector';
  const isDeploy = transaction.type === TransactionType.TRANSACTION_CREATE;
  const isDeposit = transaction.type === TransactionType.DEPOSIT;
  const isContract =
    (mainOperation?.name as unknown as IFuelTransactionNames) ===
    IFuelTransactionNames.CONTRACT_CALL;

  const isMint = ['CONTRACT_CALL', 'TRANSFER_ASSET'].every((name) =>
    transaction?.summary?.operations?.some(
      (operation) =>
        (operation.name as unknown as IFuelTransactionNames) ===
        IFuelTransactionNames[name],
    ),
  );

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
    transferAssetsOperations,
  };
};

export { useVerifyTransactionInformations };
