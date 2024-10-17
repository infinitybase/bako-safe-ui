import { TransactionStatus } from 'bakosafe';

import { queryClient } from '@/config';
import { useAuth } from '@/modules';
import { useBakoSafeTransactionSend, WitnessStatus } from '@/modules/core';
import { ITransaction } from '@/modules/core/hooks/bakosafe/utils/types';
import { useNotificationsStore } from '@/modules/notifications/store';
import { TransactionService } from '@/modules/transactions/services';

import { useTransactionToast } from '../../providers/toast';
import { useTransactionState } from '../../states';
import { TRANSACTION_HISTORY_QUERY_KEY } from '../details';

export type IUseSendTransaction = {
  onTransactionSuccess: () => void;
};

const useSendTransaction = ({ onTransactionSuccess }: IUseSendTransaction) => {
  const { setHasNewNotification } = useNotificationsStore();
  const { setIsCurrentTxPending } = useTransactionState();
  const toast = useTransactionToast();

  const { userInfos } = useAuth();

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
