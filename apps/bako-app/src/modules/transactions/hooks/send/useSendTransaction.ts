import { ITransaction } from '@bako-safe/services/modules/transaction';
import { useBakoSafeSendTransaction } from '@bako-safe/wallet/transaction';
import { TransactionStatus, WitnessStatus } from 'bakosafe';

import { queryClient } from '@/config';
import { CookieName, CookiesConfig } from '@/config/cookies';
import { transactionService } from '@/config/services-initializer';
import { useAuthContext } from '@/modules/auth/AuthProvider';
// import { useBakoSafeTransactionSend } from '@/modules/core';
import { useNotificationsStore } from '@/modules/notifications/store';
import { serverApi } from '@/utils/constants';

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

  const { userInfos } = useAuthContext();

  const { mutate: sendTransaction } = useBakoSafeSendTransaction({
    serverApi: serverApi,
    token: CookiesConfig.getCookie(CookieName.ACCESS_TOKEN),
    userAddress: userInfos.address,
    options: {
      onSuccess: async (transactionId: string) => {
        onTransactionSuccess();
        const tx = await transactionService.getById(transactionId);
        validateResult(tx);
      },
      onError: async (transactionId: string) => {
        const tx = await transactionService.getById(transactionId);
        validateResult(tx);
        onTransactionSuccess();
      },
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
