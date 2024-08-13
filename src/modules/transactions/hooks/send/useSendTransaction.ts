import { useNotificationsStore } from '@/modules/notifications/store';
import { useTransactionToast } from '../../providers/toast';
import { ITransaction, TransactionStatus } from 'bakosafe';
import { useBakoSafeTransactionSend } from '@/modules/core';

export type IUseSendTransaction = {
  onTransactionSuccess: () => void;
};

const useSendTransaction = ({ onTransactionSuccess }: IUseSendTransaction) => {
  const { setHasNewNotification } = useNotificationsStore();
  const toast = useTransactionToast();

  const { mutate: sendTransaction } = useBakoSafeTransactionSend({
    onSuccess: (transaction: ITransaction) => {
      console.log('Transaction Successfully sended:', transaction);
      onTransactionSuccess();
      validateResult(transaction);
      clearAll();
    },
    onError: (e) => {
      console.log('ERROR WHILE SEND TO CHAIN', e);
    },
  });

  const validateResult = (transaction: ITransaction, isCompleted?: boolean) => {
    console.log('validating Result', transaction.status);
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

  const clearAll = () => {
    toast.closeAll();
  };

  const executeTransaction = (transaction: ITransaction) => {
    sendTransaction({ transaction: transaction! });
  };

  return {
    executeTransaction,
  };
};

export { useSendTransaction };
