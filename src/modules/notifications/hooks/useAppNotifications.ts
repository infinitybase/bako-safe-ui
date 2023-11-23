import { useDisclosure } from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { queryClient } from '@/config';
import { NotificationStatus } from '@/modules/core';

interface UseAppNotificationsParams {
  onClose?: () => void;
  isOpen?: boolean;
  onSelect?: (vaultId: string) => void;
}

export enum NotificationFilter {
  ALL = '',
  UNREAD = NotificationStatus.UNREAD,
  READ = NotificationStatus.READ,
}

const useAppNotifications = (props?: UseAppNotificationsParams) => {
  const drawer = useDisclosure();
  const inView = useInView({ delay: 300 });

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<NotificationFilter>(
    NotificationFilter.ALL,
  );

  // TODO: Add dynamic value
  const unreadCounter = 9;

  // const notificationsListRequest = useNotificationsListRequest(
  //   { q: search },
  //   props.isOpen,
  // );

  // const setNotificationAsReadRequest = useSetNotificationAsReadRequest();

  const debouncedSearchHandler = useCallback(
    debounce((event: string | ChangeEvent<HTMLInputElement>) => {
      if (typeof event === 'string') {
        setSearch(event);
        return;
      }

      setSearch(event.target.value);
    }, 300),
    [],
  );

  // useEffect(() => {
  //   if (inView.inView && !notificationsListRequest.isLoading) {
  //     notificationsListRequest.fetchNextPage();
  //   }
  // }, [
  //   inView.inView,
  //   notificationsListRequest.isLoading,
  //   notificationsListRequest.fetchNextPage,
  //   // notificationsListRequest,
  // ]);

  // const onNotificationClick = (notificationId: string) => {
  //   queryClient.invalidateQueries('notifications/pagination');
  //   setSearch('');
  //   // TODO: setRead function
  //   setNotificationAsReadRequest.mutate({ notificationId });
  // };

  const onCloseDrawer = () => {
    props?.onClose?.();
    queryClient.invalidateQueries('notifications/pagination');
    setSearch('');
  };

  return {
    drawer: {
      ...drawer,
      onClose: onCloseDrawer,
    },
    search: {
      value: search,
      handler: debouncedSearchHandler,
    },
    inView,
    unreadCounter,
    filter: {
      set: setFilter,
      value: filter,
    },
    // request: notificationsListRequest,
    // onNotificationClick,
  };
};

export { useAppNotifications };
