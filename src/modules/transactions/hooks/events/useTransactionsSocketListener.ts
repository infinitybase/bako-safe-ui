import { useCallback } from 'react';
import { QueryKey } from '@tanstack/react-query';
import { useSocketEvent } from '@/modules/core/hooks/socket/useSocketEvent';
import { useReactQueryUpdate } from '@/modules/core/hooks/useReactQueryUpdate';
import {
  getTransactionHistoryQueryKey,
  useTransactionsSignaturePending,
} from '@/modules/transactions/hooks';
import { TransactionService } from '@/modules/transactions/services';
import { ITransactionReactQueryUpdate } from '@/modules/transactions/services/types';
import { SocketEvents } from '@/modules/core';

export const useTransactionSocketListener = (key: QueryKey) => {
  const callBackTransaction = (
    oldData: any,
    event: ITransactionReactQueryUpdate,
  ) => {
    const isInfiniteQuery = 'pages' in oldData;

    return isInfiniteQuery
      ? TransactionService.updateInfiniteTransactionReactQuery(oldData, event)
      : TransactionService.updateTransactionReactQuery(oldData, event);
  };

  const updateTransaction = useReactQueryUpdate(key, callBackTransaction);

  const historyQueryKey = useCallback(
    (event?: ITransactionReactQueryUpdate) => {
      if (!event) return [];
      return getTransactionHistoryQueryKey(
        event.transaction.id,
        event.transaction.predicateId,
      );
    },
    [],
  );

  const updateHistory = useReactQueryUpdate(
    historyQueryKey,
    TransactionService.updateTransactionHistoryReactQuery,
  );

  const { refetch: updateSignaturePending } = useTransactionsSignaturePending();
  const handleSignaturePending = () => updateSignaturePending();

  useSocketEvent<ITransactionReactQueryUpdate>(SocketEvents.TRANSACTION, [
    updateTransaction,
    updateHistory,
    handleSignaturePending,
  ]);
};
