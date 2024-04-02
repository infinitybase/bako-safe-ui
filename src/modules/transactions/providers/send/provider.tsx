import { ITransaction, TransactionStatus } from 'bakosafe';
import { createContext, PropsWithChildren, useContext, useRef } from 'react';

import { queryClient } from '@/config';
import { useBsafeTransactionSend } from '@/modules/core';

import { useTransactionToast } from './toast';

interface TransactionSendContextType {
  isExecuting: (transaction: ITransaction) => boolean;
  executeTransaction: (transaction: ITransaction) => void;
  validateResult: (transaction: ITransaction) => void;
  clearAll: () => void;
}

const TransactionSendContext = createContext<TransactionSendContextType>(
  {} as TransactionSendContextType,
);

const TransactionSendProvider = (props: PropsWithChildren) => {
  const toast = useTransactionToast();
  const transactionsRef = useRef<ITransaction[]>([]);

  const refetetchTransactionList = () => {
    const queries = ['home', 'transaction', 'assets'];
    queryClient.invalidateQueries({
      predicate: (query) =>
        queries.some((value) => query.queryHash.includes(value)),
    });
  };

  const validateResult = (transaction: ITransaction) => {
    if (transaction.status == TransactionStatus.SUCCESS) {
      toast.success(transaction);
    }

    if (transaction.status == TransactionStatus.FAILED) {
      toast.error(transaction.id, 'Transaction failed');
    }

    if (transaction.status == TransactionStatus.PROCESS_ON_CHAIN) {
      toast.loading(transaction);
    }
  };

  const { mutate: sendTransaction } = useBsafeTransactionSend({
    onSuccess: (transaction) => {
      transactionsRef.current = transactionsRef.current.filter(
        (data) => data.id !== transaction.id,
      );
      refetetchTransactionList();
      validateResult(transaction);
    },
    onError: (error) => {
      const [errorMessage, id] = error.message.split(':');
      toast.error(id, errorMessage);
      refetetchTransactionList();
    },
  });

  const isExecuting = (transaction: ITransaction) =>
    !!transactionsRef.current.find((data) => data.id === transaction.id);

  const executeTransaction = (transaction: ITransaction) => {
    if (!isExecuting(transaction)) {
      transactionsRef.current.push(transaction);
      toast.loading(transaction);
      sendTransaction({ transaction });
    }
  };

  const clearAll = () => {
    transactionsRef.current = [];
    toast.closeAll();
  };

  return (
    <TransactionSendContext.Provider
      value={{
        clearAll,
        isExecuting,
        executeTransaction,
        validateResult,
      }}
    >
      {props.children}
    </TransactionSendContext.Provider>
  );
};

const useTransactionSend = () => {
  return useContext(TransactionSendContext);
};

export { TransactionSendProvider, useTransactionSend };
