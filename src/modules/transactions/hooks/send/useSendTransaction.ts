import { useNotificationsStore } from '@/modules/notifications/store';
import { useTransactionToast } from '../../providers/toast';
import { ITransaction, TransactionStatus } from 'bakosafe';
import { WitnessStatus, useBakoSafeTransactionSend } from '@/modules/core';

export type IUseSendTransaction = {
  onTransactionSuccess: () => void;
};

const useSendTransaction = ({ onTransactionSuccess }: IUseSendTransaction) => {
  const { setHasNewNotification } = useNotificationsStore();
  const toast = useTransactionToast();

  const { mutate: sendTransaction } = useBakoSafeTransactionSend({
    onSuccess: (transaction: ITransaction) => {
      onTransactionSuccess();
      validateResult(transaction);
    },
  });

  const validateResult = (transaction: ITransaction, isCompleted?: boolean) => {
    if (transaction.status == TransactionStatus.SUCCESS || isCompleted) {
      toast.success(transaction);
    }

    if (transaction.status == TransactionStatus.FAILED) {
      toast.error(transaction.id, 'Transaction failed');
    }

    if (
      transaction.status == TransactionStatus.PROCESS_ON_CHAIN &&
      !isCompleted
    ) {
      toast.loading(transaction);
    }
    setHasNewNotification(true);
  };

  const executeTransaction = (transaction: ITransaction) => {
    const wasTheLastSignature =
      transaction.resume.witnesses.filter(
        (witness) => witness.status === WitnessStatus.PENDING,
      ).length <= 1;
    if (wasTheLastSignature) {
      toast.loading(transaction);
    }
    sendTransaction({ transaction: transaction! });
  };

  return {
    executeTransaction,
  };
};

export { useSendTransaction };
