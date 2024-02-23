import { ITransaction, TransactionStatus } from 'bsafe';
import { createContext, PropsWithChildren, useContext, useRef } from 'react';

import { queryClient } from '@/config';
import { useAuth } from '@/modules/auth/hooks';
import {
  HomeQueryKey,
  invalidateQueries,
  useBsafeTransactionSend,
  WorkspacesQueryKey,
} from '@/modules/core';
import { TRANSACTION_LIST_QUERY_KEY } from '@/modules/transactions/hooks';
import { USER_TRANSACTIONS_QUERY_KEY } from '@/modules/transactions/hooks/list';
import { VAULT_TRANSACTIONS_QUERY_KEY } from '@/modules/vault';

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
  const auth = useAuth();
  const toast = useTransactionToast();

  const transactionsRef = useRef<ITransaction[]>([]);

  const refetetchTransactionList = () => {
    invalidateQueries([
      'bsafe',
      TRANSACTION_LIST_QUERY_KEY,
      USER_TRANSACTIONS_QUERY_KEY,
      VAULT_TRANSACTIONS_QUERY_KEY,
    ]);
    invalidateQueries(
      WorkspacesQueryKey.TRANSACTION_LIST_PAGINATION_QUERY_KEY(
        auth.workspaces.current,
      ),
    );
    queryClient.invalidateQueries(
      HomeQueryKey.FULL_DATA(auth.workspaces.current),
    );
  };

  const validateResult = (transaction: ITransaction) => {
    refetetchTransactionList();
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
