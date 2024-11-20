import {
  type AssetModel,
  type ITransaction,
  WitnessStatus,
} from '@bako-safe/services';
import { type ITransactionResume, TransactionStatus } from 'bakosafe';
import { bn } from 'fuels';

import { NativeAssetId } from '../core/utils';

const { REJECTED, DONE, PENDING } = WitnessStatus;

export interface TransactionStatusParams {
  account: string;
  resume: ITransactionResume;
  status: TransactionStatus;
}

/* TODO: Fix this to use bako safe SDK */
export const transactionStatus = ({
  resume,
  account,
  ...transaction
}: TransactionStatusParams) => {
  const { requiredSigners, totalSigners, witnesses } = resume;
  const minSigners = requiredSigners;
  const vaultMembersCount = totalSigners;
  const signatureCount =
    witnesses.filter((w) => w.status === WitnessStatus.DONE).length ?? 0;
  const witness = witnesses?.find((t) => t.account === account);
  const howManyDeclined =
    witnesses.filter((w) => w.status === WitnessStatus.REJECTED).length ?? 0;

  return {
    isCompleted:
      signatureCount >= minSigners ||
      transaction.status === TransactionStatus.SUCCESS,
    isDeclined: witness?.status === REJECTED,
    isSigned: witness?.status === DONE,
    isPending: witness?.status !== PENDING,
    isReproved: vaultMembersCount - howManyDeclined < minSigners,
    isError: transaction.status === TransactionStatus.FAILED,
  };
};

export interface WaitingSignaturesParams {
  account: string;
  transactions: ITransaction[];
}

export const waitingSignatures = ({
  account,
  transactions,
}: WaitingSignaturesParams) => {
  return transactions.filter((transaction) => {
    const { isCompleted, isSigned, isDeclined, isReproved } = transactionStatus(
      {
        resume: transaction.resume,
        account,
        status: transaction.status,
      },
    );

    return !isSigned && !isDeclined && !isCompleted && !isReproved;
  }).length;
};

export const sumEthAsset = (assets: AssetModel[]) =>
  assets
    .filter((a) => a.assetId === NativeAssetId)
    .reduce((total, asset) => total.add(bn.parseUnits(asset.amount)), bn(0))
    .format();

export const expectedCommonErrorMessage = 'not enough coins to fit the target';
