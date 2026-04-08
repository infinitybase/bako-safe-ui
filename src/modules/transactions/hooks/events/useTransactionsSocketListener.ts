import { QueryKey, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { HomeQueryKey, SocketEvents, WorkspacesQueryKey } from '@/modules/core';
import { useSocketEvent } from '@/modules/core/hooks/socket/useSocketEvent';
import { useReactQueryUpdate } from '@/modules/core/hooks/useReactQueryUpdate';
import { getTransactionHistoryQueryKey } from '@/modules/transactions/hooks';
import { PENDING_TRANSACTIONS_QUERY_KEY } from '@/modules/transactions/hooks/list/useTotalSignaturesPendingRequest';
import { TransactionService } from '@/modules/transactions/services';
import {
  ITransactionInfinityQueryData,
  ITransactionQueryUpdatePage,
  ITransactionReactQueryUpdate,
} from '@/modules/transactions/services/types';
import { vaultInfinityQueryKey } from '@/modules/vault/hooks/list/useVaultTransactionsRequest';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

export const useTransactionSocketListener = (key?: QueryKey) => {
  const queryClient = useQueryClient();
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

  // Invalidate pending signatures cache instead of forcing refetch
  // This only triggers a refetch if the query is actively being observed
  const handleSignaturePending = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [PENDING_TRANSACTIONS_QUERY_KEY],
    });
  }, [queryClient]);

  // When the worker sends minimal tx data (no full transaction object),
  // the updateTransactions handler skips the cache replacement.
  // This handler invalidates the relevant queries so React Query refetches
  // the fully formatted transaction from the API.
  const handleWorkerUpdate = useCallback(
    (event: ITransactionReactQueryUpdate) => {
      if (!event?.transaction) return;

      // Detect minimal payload from worker (missing `name` field)
      if (!event.transaction.name) {
        const workspaceId = userInfos.workspace?.id ?? '';
        const { predicateId, id } = event.transaction;

        queryClient.invalidateQueries({
          queryKey: HomeQueryKey.HOME_WORKSPACE(workspaceId),
        });
        queryClient.invalidateQueries({
          queryKey:
            vaultInfinityQueryKey.VAULT_TRANSACTION_LIST_PAGINATION_QUERY_KEY(
              predicateId,
            ),
        });
        queryClient.invalidateQueries({
          queryKey:
            WorkspacesQueryKey.TRANSACTION_LIST_PAGINATION_QUERY_KEY(
              workspaceId,
            ),
        });
        queryClient.invalidateQueries({
          queryKey: getTransactionHistoryQueryKey(id, predicateId),
        });
      }
    },
    [queryClient, userInfos],
  );

  useSocketEvent<ITransactionReactQueryUpdate>(SocketEvents.TRANSACTION, [
    updateTransactions,
    updateHistory,
    handleSignaturePending,
    handleWorkerUpdate,
  ]);
};
