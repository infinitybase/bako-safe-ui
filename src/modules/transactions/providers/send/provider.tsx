import { ITransaction } from 'bsafe';
import { createContext, PropsWithChildren, useContext, useRef } from 'react';

import { invalidateQueries, useBsafeTransactionSend } from '@/modules/core';
import {
  TRANSACTION_LIST_PAGINATION_QUERY_KEY,
  TRANSACTION_LIST_QUERY_KEY,
} from '@/modules/transactions/hooks';
import { USER_TRANSACTIONS_QUERY_KEY } from '@/modules/transactions/hooks/list';
import { VAULT_TRANSACTIONS_QUERY_KEY } from '@/modules/vault';

import { useTransactionToast } from './toast';

interface TransactionSendContextType {
  isExecuting: (transaction: ITransaction) => boolean;
  executeTransaction: (transaction: ITransaction) => void;

  clearAll: () => void;
}

const TransactionSendContext = createContext<TransactionSendContextType>(
  {} as TransactionSendContextType,
);

const TransactionSendProvider = (props: PropsWithChildren) => {
  const toast = useTransactionToast();

  const transactionsRef = useRef<ITransaction[]>([]);

  const refetetchTransactionList = () =>
    invalidateQueries([
      'bsafe',
      TRANSACTION_LIST_QUERY_KEY,
      USER_TRANSACTIONS_QUERY_KEY,
      VAULT_TRANSACTIONS_QUERY_KEY,
      TRANSACTION_LIST_PAGINATION_QUERY_KEY,
    ]);

  const { mutate: sendTransaction } = useBsafeTransactionSend({
    onSuccess: (transaction) => {
      toast.success(transaction);
      refetetchTransactionList();
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
    toast.close(transaction.id);
    transactionsRef.current.push(transaction);
    toast.loading(transaction);
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
