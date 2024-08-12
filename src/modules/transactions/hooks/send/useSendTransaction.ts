import { useNotificationsStore } from '@/modules/notifications/store';
import { useTransactionToast } from '../../providers/send/toast';
import { ITransaction, TransactionStatus } from 'bakosafe';
import { useBakoSafeTransactionSend } from '@/modules/core';
import { IUsePredicateTransactionsReturn } from '../predicate';
import { IPendingTransactionsRecord, IUseTransactionList } from '../list';

interface IUseSignTransactionProps {
  transactionList: IUseTransactionList;
  predicateTransactions: IUsePredicateTransactionsReturn;
}

const useSendTransaction = ({
  predicateTransactions,
  transactionList,
}: IUseSignTransactionProps) => {
  const { setHasNewNotification } = useNotificationsStore();
  const toast = useTransactionToast();
  const transactionsInExecution: ITransaction[] = [];

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

  // const { mutate: sendTransaction } = useBakoSafeTransactionSend({
  //   // onSuccess: (transaction) => {
  //   //   console.log('ONSUCCESS_AFTER_SEND', transaction);
  //   //   transactionList.transactionRequest.refetch();
  //   //   meTransactions.transactionsRequest.refetch();
  //   //   homeTransactions.request.refetch();
  //   //   validateResult(transaction);
  //   //   transactionsInExecution.pop();
  //   //   clearAll();
  //   // },
  //   // onError: (error: any) => {
  //   //   const [errorMessage, id] = error.message.split(':');
  //   //   toast.error(id, errorMessage);
  //   //   transactionList.transactionRequest.refetch();
  //   //   meTransactions.transactionsRequest.refetch();
  //   //   homeTransactions.request.refetch();
  //   // },
  // });

  const isExecuting = (transaction: ITransaction) => {
    return transactionsInExecution[transaction?.id];
  };

  const executeTransaction = (transaction: ITransaction) => {
    console.log('EXECUTING:', transaction);
    toast.loading(transaction);
    // sendTransaction({ transaction });
  };

  const clearAll = () => {
    toast.closeAll();
  };

  return {
    executeTransaction,
  };
};

export { useSendTransaction };
