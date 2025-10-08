import { TransactionStatus, TransactionType } from 'bakosafe';
import { Address, OperationName } from 'fuels';
import { useMemo } from 'react';

import { tokensIDS } from '@/modules/core/utils/assets/address';

import { BRIDGE_TRANSACTION_TYPES, TransactionWithVault } from '../../services';

const useVerifyTransactionInformations = (
  transaction: TransactionWithVault,
) => {
  const mainOperation = transaction?.summary?.operations?.[0];
  const isFromConnector = transaction.summary?.type === 'connector';
  const isDeploy = transaction.type === TransactionType.TRANSACTION_CREATE;
  const isDeposit = transaction.type === TransactionType.DEPOSIT;
  const isLiquidStake =
    transaction.name === 'Liquid Stake' &&
    transaction.assets[0].assetId === tokensIDS.FUEL;
  const isBridge = transaction.name.includes(BRIDGE_TRANSACTION_TYPES);

  const isContract = useMemo(
    () =>
      transaction?.summary?.operations.some(
        (op) =>
          (op.name as unknown as OperationName) ===
            OperationName.contractCall || !op.assetsSent,
      ) ?? false,
    [transaction],
  );

  const isFromCLI = transaction.summary?.type === 'cli' && isContract;

  const isMint = useMemo(
    () =>
      transaction?.summary?.operations?.some((operation) => {
        const isContractCallWithAssets =
          (operation.name as unknown as OperationName) ===
            OperationName.contractCall && operation.assetsSent;

        const hasContractCallAndTransferAsset = [
          OperationName.contractCall,
          OperationName.transfer,
        ].every((name) =>
          transaction.summary?.operations.some((op) => op.name === name),
        );

        return isContractCallWithAssets || hasContractCallAndTransferAsset;
      }) ?? false,
    [transaction],
  );

  const isReceivingAssets = useMemo(
    () =>
      transaction.summary?.operations.some(
        (op) =>
          op.assetsSent &&
          op.to?.address === transaction?.predicate?.predicateAddress,
      ) && !isDeposit,
    [transaction, isDeposit],
  );

  const isPending = transaction.status === TransactionStatus.AWAIT_REQUIREMENTS;

  // TODO: Remove this
  const isFuelFriday = useMemo(
    () =>
      isDeposit &&
      transaction.summary?.operations.some((op) => {
        const [usdf] = op?.assetsSent ?? [];

        if (
          op?.from?.address !==
            '0xc3903ce151a45aa44229af6df9223b1ab033cb7d567e92f43631db024e7a8146' ||
          !usdf
        )
          return false;

        return (
          usdf.assetId ===
          '0x33a6d90877f12c7954cca6d65587c25e9214c7bed2231c188981c7114c1bdb78'
        );
      }),
    [isDeposit, transaction],
  );

  const isSwap = useMemo(
    () => transaction.name.includes('Swap'),
    [transaction],
  );

  const contractAddress = isContract
    ? Address.fromB256(mainOperation?.to?.address ?? '').toString()
    : '';

  const showAmountInformations =
    ((isContract && !isMint) || isDeploy || isReceivingAssets) ?? false;

  return {
    mainOperation,
    isFromConnector,
    isDeploy,
    isDeposit,
    isContract,
    isPending,
    contractAddress,
    isMint,
    isFuelFriday,
    isReceivingAssets,
    isFromCLI,
    isLiquidStake,
    isBridge,
    showAmountInformations,
    isSwap,
  };
};

export { useVerifyTransactionInformations };
