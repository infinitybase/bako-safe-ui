import { QueryKey } from '@tanstack/react-query';
import { useCallback } from 'react';

import { HomeQueryKey, jamMonitor, SocketEvents, WorkspacesQueryKey } from '@/modules/core';
import { useSocketEvent } from '@/modules/core/hooks/socket/useSocketEvent';
import { useReactQueryUpdate } from '@/modules/core/hooks/useReactQueryUpdate';
import {
  getTransactionHistoryQueryKey,
  useTransactionsSignaturePending,
} from '@/modules/transactions/hooks';
import { TransactionService } from '@/modules/transactions/services';
import {
  ITransactionInfinityQueryData,
  ITransactionQueryUpdatePage,
  ITransactionReactQueryUpdate,
} from '@/modules/transactions/services/types';
import { vaultInfinityQueryKey } from '@/modules/vault/hooks/list/useVaultTransactionsRequest';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

export const useTransactionSocketListener = (key?: QueryKey) => {
  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();

  const callBackUpdateDataTransaction = (
    oldData: ITransactionQueryUpdatePage | ITransactionInfinityQueryData,
    event: ITransactionReactQueryUpdate,
  ) => {
    const isInfiniteQuery = 'pages' in oldData;

    return isInfiniteQuery
      ? TransactionService.updateInfiniteTransactionReactQuery(oldData, event)
      : TransactionService.updateTransactionReactQuery(oldData, event);
  };

  const defaultKeys = (event?: ITransactionReactQueryUpdate) => {
    if (!event) return [];

    const {
      transaction: { predicateId },
    } = event;

    const workspaceId = userInfos.workspace?.id ?? '';

    return [
      HomeQueryKey.HOME_WORKSPACE(workspaceId),
      vaultInfinityQueryKey.VAULT_TRANSACTION_LIST_PAGINATION_QUERY_KEY(
        predicateId,
      ),
      WorkspacesQueryKey.TRANSACTION_LIST_PAGINATION_QUERY_KEY(workspaceId),
    ];
  };

  const updateTransactions = useReactQueryUpdate(
    defaultKeys,
    callBackUpdateDataTransaction,
  );

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

  // Log socket transaction events for Jam monitoring
  const handleJamMonitor = useCallback((event: ITransactionReactQueryUpdate) => {
    if (!event) return;

    jamMonitor.socketTxUpdate({
      event: SocketEvents.TRANSACTION,
      transactionId: event.transaction?.id,
      type: event.type,
      metadata: {
        status: event.transaction?.status,
        predicateId: event.transaction?.predicateId,
      },
    });

    // Log specific event types
    if (event.type === '[CREATED]') {
      jamMonitor.socketTxCreated({
        event: SocketEvents.TRANSACTION,
        transactionId: event.transaction?.id,
      });
    } else if (event.type === '[UPDATED]') {
      jamMonitor.txStatusChange({
        transactionId: event.transaction?.id,
        transactionHash: event.transaction?.hash,
        status: event.transaction?.status,
      });
    }
  }, []);

  useSocketEvent<ITransactionReactQueryUpdate>(SocketEvents.TRANSACTION, [
    updateTransactions,
    updateHistory,
    handleSignaturePending,
    handleJamMonitor,
  ]);
};
