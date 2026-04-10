import { TransactionStatus } from 'bakosafe';
import { useCallback, useRef } from 'react';

import { queryClient } from '@/config';
import {
  HomeQueryKey,
  SocketEvents,
  WorkspacesQueryKey,
  useAuth,
} from '@/modules';
import { useBakoSafeTransactionSend, WitnessStatus } from '@/modules/core';
import { ITransaction } from '@/modules/core/hooks/bakosafe/utils/types';
import { useSocketEvent } from '@/modules/core/hooks/socket/useSocketEvent';
import { useNotificationsStore } from '@/modules/notifications/store';
import { TransactionService } from '@/modules/transactions/services';
import { ITransactionReactQueryUpdate } from '@/modules/transactions/services/types';
import { vaultInfinityQueryKey } from '@/modules/vault/hooks/list/useVaultTransactionsRequest';

import { toaster } from '@/components/ui/toaster';

import { useTransactionToast } from '../../providers/toast';
import { useTransactionState } from '../../states';
import { TRANSACTION_HISTORY_QUERY_KEY } from '../details';

const POLL_FALLBACK_INTERVAL_MS = 15000; // 15s
const POLL_FALLBACK_TIMEOUT_MS = 10 * 60 * 1000; // 10min

export type IUseSendTransaction = {
  onTransactionSuccess: () => void;
};

const useSendTransaction = ({ onTransactionSuccess }: IUseSendTransaction) => {
  const { setHasNewNotification } = useNotificationsStore();
  const { isCurrentTxPending, setIsCurrentTxPending } = useTransactionState();
  const toast = useTransactionToast();
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const { userInfos } = useAuth();

  /**
   * Resolves a pending transaction — closes the loading toast,
   * updates lists, and notifies. Used by both socket and polling fallback.
   */
  const resolveTransaction = useCallback(
    (tx: ITransaction) => {
      // Clear polling fallback if active
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }

      if (
        tx.status === TransactionStatus.SUCCESS ||
        tx.status === TransactionStatus.FAILED
      ) {
        // Dismiss loading toast and create a new result toast.
        // toaster.update doesn't work reliably with loading toasts,
        // so we dismiss + create instead.
        toaster.dismiss(tx.id);
        if (tx.status === TransactionStatus.SUCCESS) {
          toaster.create({
            type: 'success',
            title: 'Transaction success',
            duration: 5000,
          });
        } else {
          toaster.create({
            type: 'error',
            title: 'Error on send your transaction',
            description: 'Transaction failed',
            duration: 5000,
          });
        }

        setIsCurrentTxPending({ isPending: false, transactionId: '' });
        queryClient.invalidateQueries({
          queryKey: [TRANSACTION_HISTORY_QUERY_KEY, tx.id, tx.predicateId],
        });
        const workspaceId = userInfos.workspace?.id ?? '';
        queryClient.invalidateQueries({
          queryKey: HomeQueryKey.HOME_WORKSPACE(workspaceId),
        });
        queryClient.invalidateQueries({
          queryKey:
            vaultInfinityQueryKey.VAULT_TRANSACTION_LIST_PAGINATION_QUERY_KEY(
              tx.predicateId,
            ),
        });
        queryClient.invalidateQueries({
          queryKey:
            WorkspacesQueryKey.TRANSACTION_LIST_PAGINATION_QUERY_KEY(
              workspaceId,
            ),
        });
        setHasNewNotification(true);
      }
    },
    [toast, setIsCurrentTxPending, setHasNewNotification, userInfos],
  );

  /**
   * Starts a polling fallback that checks the transaction status periodically.
   * Covers cases where the socket event is missed (disconnect, tab background, etc).
   */
  const startPollFallback = useCallback(
    (transactionId: string) => {
      if (pollRef.current) clearInterval(pollRef.current);

      const startTime = Date.now();

      pollRef.current = setInterval(async () => {
        // Stop after timeout
        if (Date.now() - startTime > POLL_FALLBACK_TIMEOUT_MS) {
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
          return;
        }

        // Check if socket already resolved
        const current = useTransactionState.getState().isCurrentTxPending;
        if (!current.isPending || current.transactionId !== transactionId) {
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
          return;
        }

        try {
          const tx = await TransactionService.getById(transactionId);
          if (
            tx.status === TransactionStatus.SUCCESS ||
            tx.status === TransactionStatus.FAILED
          ) {
            resolveTransaction(tx);
          }
        } catch {
          // API unreachable — retry next interval
        }
      }, POLL_FALLBACK_INTERVAL_MS);
    },
    [resolveTransaction],
  );

  // Socket listener — primary path for receiving async tx result
  const handleAsyncResult = useCallback(
    (event: ITransactionReactQueryUpdate) => {
      if (!isCurrentTxPending.isPending) return;
      if (!event?.transaction?.name) return;
      if (event.transaction.id !== isCurrentTxPending.transactionId) return;

      const { status } = event.transaction;
      if (
        status === TransactionStatus.SUCCESS ||
        status === TransactionStatus.FAILED
      ) {
        resolveTransaction(event.transaction as ITransaction);
      }
    },
    [isCurrentTxPending, resolveTransaction],
  );

  useSocketEvent<ITransactionReactQueryUpdate>(SocketEvents.TRANSACTION, [
    handleAsyncResult,
  ]);

  const { mutate: sendTransaction } = useBakoSafeTransactionSend({
    onSuccess: (transaction: ITransaction) => {
      onTransactionSuccess();
      validateResult(transaction);
    },
    onError: async (transaction) => {
      const tx = await TransactionService.getById(transaction.id);
      validateResult(tx);
      onTransactionSuccess();
    },
  });

  const validateResult = (transaction: ITransaction, isCompleted?: boolean) => {
    if (transaction.status == TransactionStatus.SUCCESS || isCompleted) {
      resolveTransaction(transaction);
    }

    if (transaction.status == TransactionStatus.FAILED) {
      resolveTransaction(transaction);
    }

    if (
      transaction.status == TransactionStatus.PROCESS_ON_CHAIN &&
      !isCompleted
    ) {
      toast.loading(transaction);
    }
    setHasNewNotification(true);
  };

  const executeTransaction = (
    transaction: Pick<
      ITransaction,
      'id' | 'predicateId' | 'resume' | 'name' | 'predicateAddress' | 'hash'
    >,
  ) => {
    const wasTheLastSignature =
      transaction!.resume!.witnesses.filter(
        (witness) => witness.status === WitnessStatus.PENDING,
      ).length <= 1;

    if (wasTheLastSignature || transaction.resume.requiredSigners === 1) {
      toast.loading(transaction);
      setIsCurrentTxPending({ isPending: true, transactionId: transaction.id });
      startPollFallback(transaction.id);
    }
    sendTransaction({
      transaction: transaction!,
      providerUrl: userInfos.network.url,
    });
  };

  return {
    executeTransaction,
  };
};

export { useSendTransaction };
