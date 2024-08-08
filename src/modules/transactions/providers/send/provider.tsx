/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ITransaction, TransactionStatus } from 'bakosafe';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from 'react';

import { queryClient } from '@/config';
import { useBakoSafeTransactionSend } from '@/modules/core';

import { useTransactionToast } from './toast';
import { useNotificationsStore } from '@/modules/notifications/store';
import { expectedCommonErrorMessage } from '../../utils';
import { useSignTransaction } from '../../hooks/signature';

interface TransactionSendContextType {
  isExecuting: (transaction: ITransaction) => boolean;
  executeTransaction: (transaction: ITransaction) => void;
  validateResult: (transaction: ITransaction) => void;
  clearAll: () => void;
  signTransaction: {
    confirmTransaction: (callback?: (() => void) | undefined) => Promise<void>;
    declineTransaction: (transactionId: string) => Promise<void>;
    isTransactionLoading: boolean;
    isTransactionSuccess: boolean;
    setCurrentTransaction: (transaction: ITransaction) => void;
    retryTransaction: () => Promise<void>;
  };
}

const TransactionSendContext = createContext<TransactionSendContextType>(
  {} as TransactionSendContextType,
);

const TransactionSendProvider = (props: PropsWithChildren) => {
  const { setHasNewNotification } = useNotificationsStore();
  const [currentTransaction, setCurrentTransaction] = useState<ITransaction>();
  const {
    confirmTransaction,
    declineTransaction,
    isLoading: isTransactionLoading,
    isSuccess: isTransactionSuccess,
    retryTransaction,
  } = useSignTransaction({ transaction: currentTransaction! });

  const toast = useTransactionToast();
  const transactionsRef = useRef<ITransaction[]>([]);

  const isExecuting = (transaction: ITransaction) =>
    !!transactionsRef.current.find((data) => data.id === transaction.id);

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

  const { mutate: sendTransaction } = useBakoSafeTransactionSend({
    onSuccess: (transaction) => {
      transactionsRef.current = transactionsRef.current.filter(
        (data) => data.id !== transaction.id,
      );

      validateResult(transaction);
    },

    onError: (error) => {
      const [errorMessage, id] = error.message.split(':');
      toast.error(id, errorMessage);
    },
  });

  const executeTransaction = (transaction: ITransaction) => {
    console.log('executed', transaction);
    if (!isExecuting(transaction)) {
      transactionsRef.current.push(transaction);
      toast.loading(transaction);
      // sendTransaction({ transaction });
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
        signTransaction: {
          setCurrentTransaction,
          confirmTransaction,
          declineTransaction,
          retryTransaction,
          isTransactionLoading,
          isTransactionSuccess,
        },
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

// const refetetchTransactionList = () => {
//   const queries = ['home', 'transaction', 'assets'];
//   queryClient.invalidateQueries({
//     predicate: (query) =>
//       queries.some((value) => query.queryHash.includes(value)),
//   });
// };

// @ts-ignore
//  onError: (error, { transaction }: { transaction: ITransaction }) => {
//   const [errorMessage, id] = error.message.split(':');
//   const errorMessageSecondCase = error.message || error.toString();

//   // Essa tratativa de erro/solução é um caso específico, referente a situação/comentários do hook useBakoSafeTransactionSend(src/modules/core/hooks/bakosafe/transactions)
//   // que devido a forma como o instanciamento das transações/vaults são feitos, está sendo retornado um erro de "not enough coins"
//   // O que não é o caso, pois há validações para evitar que uma transação seja criada sem que haja o valor disponível no vault.
//   // Essa solução (isCompleted) usa a mesma lógica do "transactionStatus" (caminho: src/modules/transactions/utils) para definir se uma transação foi concluída ou não.
//   const isNotEnoughError =
//     errorMessage.includes(expectedCommonErrorMessage) ||
//     errorMessageSecondCase?.includes(expectedCommonErrorMessage);
//   if (isNotEnoughError) {
//     transactionsRef.current = transactionsRef.current.filter(
//       (data) => data.id !== transaction.id,
//     );

//     refetetchTransactionList();
//     const { requiredSigners, witnesses: witnessesResume } =
//       transaction.resume;

//     const signatureCount =
//       witnessesResume?.filter((w) => w !== null).length ?? 0;

//     const isCompleted = signatureCount >= requiredSigners;
//     validateResult(transaction, isCompleted);

//     return;
//   }

//   toast.error(id, errorMessage);
//   refetetchTransactionList();
// },
