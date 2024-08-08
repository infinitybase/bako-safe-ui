import { ITransaction, TransactionStatus } from 'bakosafe';
import { useTransactionToast } from '../send/toast';
import { useNotificationsStore } from '@/modules/notifications/store';

const validateResult = (transaction: ITransaction, isCompleted?: boolean) => {
  const { setHasNewNotification } = useNotificationsStore();
  const toast = useTransactionToast();
  console.log('validatiing?');
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

export { validateResult };
