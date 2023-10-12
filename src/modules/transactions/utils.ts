import {
  Transaction,
  TransactionStatus,
  Witness,
  WitnessStatus,
} from '@/modules';

const { REJECTED, DONE, PENDING } = WitnessStatus;

export interface TransactionStatusParams extends Transaction {
  account: string;
}

export const transactionStatus = ({
  predicate,
  witnesses,
  account,
  ...transaction
}: TransactionStatusParams) => {
  const { minSigners } = predicate;
  const vaultMembersCount = predicate.addresses.length;
  const signatureCount = witnesses.filter((t) => t.status === DONE).length;
  const witness = witnesses.find((t: Witness) => t.account === account);
  const howManyDeclined = witnesses.filter((w) => w.status === REJECTED).length;

  return {
    isCompleted:
      signatureCount >= minSigners ||
      transaction.status === TransactionStatus.DONE,
    isDeclined: witness?.status === REJECTED,
    isSigned: witness?.status === DONE,
    isPending: witness?.status !== PENDING,
    isReproved: vaultMembersCount - howManyDeclined < minSigners,
    isError: transaction.status === TransactionStatus.ERROR,
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
      { ...transaction, account },
    );

    return !isSigned && !isDeclined && !isCompleted && !isReproved;
  }).length;
};
