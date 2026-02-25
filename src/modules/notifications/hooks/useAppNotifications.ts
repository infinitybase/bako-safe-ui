import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

import {
  invalidateQueries,
  NotificationsQueryKey,
  NotificationSummary,
  Pages,
  SocketEvents,
  SocketRealTimeNotifications,
  SocketUsernames,
  useSocket,
} from '@/modules/core';
import { useTransactionState } from '@/modules/transactions/states';

import { useWorkspaceContext } from '@/modules/workspace/hooks';
import { useNotificationsStore } from '../store/useNotificationsStore';
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

type HandleWithSocketEventProps = {
  sessionId: string;
  to: string;
  type: string;
};

const useAppNotifications = (props?: UseAppNotificationsParams) => {
  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: { handleWorkspaceSelection },
    },
  } = useWorkspaceContext();
  const navigate = useNavigate();
  const inView = useInView({ delay: 300 });
  const notificationsListRequest = useListNotificationsRequest(
    userInfos.address,
  );
  const { socket } = useSocket();

  const unreadNotificationsRequest = useUnreadNotificationsCounterRequest();
  const setNotificationAsReadRequest = useSetNotificationsAsReadRequest();
  const { setSelectedTransaction } = useTransactionState();
  const {
    unreadCounter,
    setUnreadCounter,
    hasNewNotification,
    setHasNewNotification,
  } = useNotificationsStore();

  const handleWithSocketEvent = ({
    sessionId,
    to,
    type,
  }: HandleWithSocketEventProps) => {
    if (
      to === SocketUsernames.UI &&
      type === SocketRealTimeNotifications.NEW_NOTIFICATION &&
      sessionId === userInfos.id
    ) {
      unreadNotificationsRequest.refetch();
    }
  };

  const onCloseDrawer = () => {
    const hasUnread = !!unreadCounter;

    if (hasUnread && unreadCounter > 0) {
      invalidateQueries([NotificationsQueryKey.UNREAD_COUNTER]);
      setUnreadCounter(0);
    }
    props?.onClose?.();

    if (hasUnread) setNotificationAsReadRequest.mutate({});
  };

  const onSelectNotification = (summary: NotificationSummary) => {
    const {
      transactionId,
      transactionName,
      vaultId,
      workspaceId: summaryWorkspaceId,
    } = summary;
    const isTransaction = summary?.transactionId;

    onCloseDrawer();

    if (isTransaction)
      setSelectedTransaction({ name: transactionName, id: transactionId });

    const page = isTransaction
      ? Pages.transactions({ vaultId, workspaceId: summaryWorkspaceId })
      : Pages.detailsVault({ vaultId, workspaceId: summaryWorkspaceId });

    handleWorkspaceSelection(summaryWorkspaceId, page);
  };

  useEffect(() => {
    if (hasNewNotification) {
      notificationsListRequest.refetch();
      unreadNotificationsRequest.refetch();
      setHasNewNotification(false);
    }
  }, [hasNewNotification]);

  useEffect(() => {
    if (
      inView.inView &&
      !notificationsListRequest.isLoading &&
      notificationsListRequest.hasNextPage
    ) {
      notificationsListRequest.fetchNextPage();
    }
  }, [
    inView.inView,
    notificationsListRequest.isLoading,
    notificationsListRequest.fetchNextPage,
    notificationsListRequest.hasNextPage,
  ]);

  useEffect(() => {
    setUnreadCounter(unreadNotificationsRequest?.data?.total ?? 0);
  }, [unreadNotificationsRequest?.data, hasNewNotification]);

  useEffect(() => {
    socket.on(SocketEvents.NOTIFICATION, handleWithSocketEvent);

    return () => {
      socket.off(SocketEvents.NOTIFICATION, handleWithSocketEvent);
    };
  }, []);

  return {
    drawer: {
      onSelectNotification: props?.onSelect ?? onSelectNotification,
      onClose: onCloseDrawer,
    },
    inView,
    unreadCounter,
    setUnreadCounter,
    notificationsListRequest,
    navigate,
    onSelectNotification,
  };
};

export { useAppNotifications };
