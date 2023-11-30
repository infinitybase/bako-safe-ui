import { useDisclosure } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import { queryClient } from '@/config';
import { NotificationSummary, Pages } from '@/modules/core';
import { useTransactionState } from '@/modules/transactions/states';

import { useListNotificationsRequest } from './useListNotificationsRequest';
import { useSetNotificationsAsReadRequest } from './useSetNotificationsAsReadRequest';
import { useUnreadNotificationsCounterRequest } from './useUnreadNotificationsCounterRequest';

interface UseAppNotificationsParams {
  onClose?: () => void;
  isOpen?: boolean;
  onSelect?: (vaultId: string) => void;
}

export interface TransactionRedirect {
  id?: string;
  name?: string;
}

const useAppNotifications = (props?: UseAppNotificationsParams) => {
  const navigate = useNavigate();
  const drawer = useDisclosure();
  const inView = useInView({ delay: 300 });
  const notificationsListRequest = useListNotificationsRequest();
  const unreadNotificationsRequest = useUnreadNotificationsCounterRequest();
  const setNotificationAsReadRequest = useSetNotificationsAsReadRequest();
  const unreadCounter = unreadNotificationsRequest.data?.total ?? 0;
  const { setSelectedTransaction } = useTransactionState();

  const onCloseDrawer = () => {
    props?.onClose?.();

    if (unreadCounter > 0) setNotificationAsReadRequest.mutate({});

    queryClient.invalidateQueries([
      'notifications/pagination',
      'notifications/counter',
    ]);
  };

  const onNotificationClick = (summary: NotificationSummary) => {
    const isTransaction = summary?.transactionId;
    const { transactionId, transactionName, vaultId } = summary;

    if (isTransaction)
      setSelectedTransaction({ name: transactionName, id: transactionId });

    const page = isTransaction
      ? Pages.transactions({ vaultId })
      : Pages.detailsVault({ vaultId });

    onCloseDrawer();
    navigate(page);
  };

  useEffect(() => {
    if (inView.inView && !notificationsListRequest.isLoading) {
      notificationsListRequest.fetchNextPage();
    }
  }, [
    inView.inView,
    notificationsListRequest.isLoading,
    notificationsListRequest.fetchNextPage,
  ]);

  return {
    drawer: { ...drawer, onClose: onCloseDrawer },
    inView,
    unreadCounter,
    notificationsListRequest,
    navigate,
    onNotificationClick,
  };
};

export { useAppNotifications };
