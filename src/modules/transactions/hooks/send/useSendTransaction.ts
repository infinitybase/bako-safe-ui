import { useNotificationsStore } from '@/modules/notifications/store';
import { useTransactionToast } from '../../providers/send/toast';
import { ITransaction, TransactionStatus } from 'bakosafe';
import { useBakoSafeTransactionSend } from '@/modules/core';

const useSendTransaction = (listToRefetch?: () => void) => {
  const { setHasNewNotification } = useNotificationsStore();
  const toast = useTransactionToast();
  const transactionsInExecution: ITransaction[] = [];

  const { mutate: sendTransaction } = useBakoSafeTransactionSend({
    onSuccess: (transaction: ITransaction) => {
      console.log('transaction:', transaction);
      validateResult(transaction);
      listToRefetch && listToRefetch();
      clearAll();
    },
    onError: (e) => {
      console.log('ERROR WHILE SEND TO CHAIN', e);
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

  const isExecuting = (transaction: ITransaction) => {
    return transactionsInExecution[transaction?.id];
  };

  const executeTransaction = (transaction: ITransaction) => {
    console.log('EXECUTING:', transaction);
    toast.loading(transaction);
    sendTransaction({ transaction });
  };

  const clearAll = () => {
    toast.closeAll();
  };

  return {
    executeTransaction,
  };
};

export { useSendTransaction };
