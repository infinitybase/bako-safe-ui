import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
} from 'react';

import { invalidateQueries, Transaction } from '@/modules/core';
import {
  TRANSACTION_LIST_PAGINATION_QUERY_KEY,
  TRANSACTION_LIST_QUERY_KEY,
  useTransactionSendRequest,
} from '@/modules/transactions/hooks';
import { USER_TRANSACTIONS_QUERY_KEY } from '@/modules/transactions/hooks/list';
import { VAULT_TRANSACTIONS_QUERY_KEY } from '@/modules/vault';

import { useTransactionToast } from './toast';

interface TransactionSendContextType {
  isExecuting: (transaction: Transaction) => boolean;
  executeTransaction: (transaction: Transaction) => void;
  clearAll: () => void;
}

const TransactionSendContext = createContext<TransactionSendContextType>(
  {} as TransactionSendContextType,
);

const TransactionSendProvider = (props: PropsWithChildren) => {
  const toast = useTransactionToast();

  const transactionsRef = useRef<Transaction[]>([]);

  const refetetchTransactionList = () =>
    invalidateQueries([
      TRANSACTION_LIST_QUERY_KEY,
      USER_TRANSACTIONS_QUERY_KEY,
      VAULT_TRANSACTIONS_QUERY_KEY,
      TRANSACTION_LIST_PAGINATION_QUERY_KEY,
    ]);

  const { mutate: sendTransaction } = useTransactionSendRequest({
    onSuccess: (transaction) => {
      toast.success(transaction);
      refetetchTransactionList();
    },
    onError: (_, { transaction }) => {
      toast.error(transaction);
      refetetchTransactionList();
    },
  });

  const isExecuting = (transaction: Transaction) =>
    !!transactionsRef.current.find((data) => data.id === transaction.id);

  const executeTransaction = (transaction: Transaction) => {
    if (isExecuting(transaction)) return;

    toast.loading(transaction);
    transactionsRef.current.push(transaction);
    sendTransaction({ transaction });
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
