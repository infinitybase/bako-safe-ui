import { TransactionStatus } from 'bsafe';
import { bn } from 'fuels';

import {
  AssetModel,
  NativeAssetId,
  Transaction,
  Witness,
  WitnessStatus,
} from '@/modules/core';

const { REJECTED, DONE, PENDING } = WitnessStatus;

export interface TransactionStatusParams {
  account: string;
  predicate: {
    addresses: string[];
    minSigners: number;
  };
  witnesses: Witness[];
  status: TransactionStatus;
}

/* TODO: Fix this to use BSAFE SDK */
export const transactionStatus = ({
  predicate,
  witnesses,
  account,
  ...transaction
}: TransactionStatusParams) => {
  const { minSigners } = predicate;
  // const vaultMembersCount = predicate.addresses.length;
  const vaultMembersCount = predicate?.addresses?.length ?? 0;
  const signatureCount = witnesses?.filter((t) => t.status === DONE).length;
  const witness = witnesses?.find((t) => t.account === account);
  const howManyDeclined = witnesses?.filter((w) => w.status === REJECTED)
    .length;

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
  transactions: Transaction[];
}

export const waitingSignatures = ({
  account,
  transactions,
}: WaitingSignaturesParams) => {
  return transactions.filter((transaction) => {
    const { isCompleted, isSigned, isDeclined, isReproved } = transactionStatus(
      {
        predicate: {
          addresses: transaction.predicate.addresses,
          minSigners: transaction.predicate.minSigners,
        },
        account,
        witnesses: transaction.witnesses,
        status: transaction.status,
      },
    );

    return !isSigned && !isDeclined && !isCompleted && !isReproved;
  }).length;
};

export const sumEthAsset = (assets: AssetModel[]) =>
  assets
    .filter((a) => a.assetID === NativeAssetId)
    .reduce((total, asset) => total.add(bn.parseUnits(asset.amount)), bn(0))
    .format();
