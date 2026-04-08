import { TransactionStatus } from 'bakosafe';
import { useCallback } from 'react';

import { queryClient } from '@/config';
import { SocketEvents, useAuth } from '@/modules';
import { useBakoSafeTransactionSend, WitnessStatus } from '@/modules/core';
import { ITransaction } from '@/modules/core/hooks/bakosafe/utils/types';
import { useSocketEvent } from '@/modules/core/hooks/socket/useSocketEvent';
import { useNotificationsStore } from '@/modules/notifications/store';
import { TransactionService } from '@/modules/transactions/services';
import { ITransactionReactQueryUpdate } from '@/modules/transactions/services/types';

import { useTransactionToast } from '../../providers/toast';
import { useTransactionState } from '../../states';
import { TRANSACTION_HISTORY_QUERY_KEY } from '../details';

export type IUseSendTransaction = {
  onTransactionSuccess: () => void;
};

const useSendTransaction = ({ onTransactionSuccess }: IUseSendTransaction) => {
  const { setHasNewNotification } = useNotificationsStore();
  const { isCurrentTxPending, setIsCurrentTxPending } = useTransactionState();
  const toast = useTransactionToast();

  const { userInfos } = useAuth();

  // Resolve the loading toast when the worker reports the final status
  // via socket. Only acts on full tx data (has `name`) with terminal status.
  const handleAsyncResult = useCallback(
    (event: ITransactionReactQueryUpdate) => {
      if (!isCurrentTxPending.isPending) return;
      if (!event?.transaction?.name) return;
      if (event.transaction.id !== isCurrentTxPending.transactionId) return;

      const { status } = event.transaction;

      if (status === TransactionStatus.SUCCESS) {
        toast.success(event.transaction as ITransaction);
        setIsCurrentTxPending({ isPending: false, transactionId: '' });
        queryClient.invalidateQueries({
          queryKey: [
            TRANSACTION_HISTORY_QUERY_KEY,
            event.transaction.id,
            event.transaction.predicateId,
          ],
        });
        setHasNewNotification(true);
      }

      if (status === TransactionStatus.FAILED) {
        toast.error(event.transaction.id, 'Transaction failed');
        setIsCurrentTxPending({ isPending: false, transactionId: '' });
        setHasNewNotification(true);
      }
    },
    [isCurrentTxPending, setIsCurrentTxPending, toast, setHasNewNotification],
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
      toast.success(transaction);
      setIsCurrentTxPending({ isPending: false, transactionId: '' });
      queryClient.invalidateQueries({
        queryKey: [
          TRANSACTION_HISTORY_QUERY_KEY,
          transaction.id,
          transaction.predicateId,
        ],
      });
    }

    if (transaction.status == TransactionStatus.FAILED) {
      toast.error(transaction.id, 'Transaction failed');
      setIsCurrentTxPending({ isPending: false, transactionId: '' });
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
