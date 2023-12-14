import {
  Box,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';

import { CustomSkeleton, ErrorIcon } from '@/components';

import { useAppNotifications } from '../../hooks';
import { NotificationsEmptyState } from '../emptyState';
import { NotificationCard } from '../notificationCard';

interface NotificationsDrawerProps extends Omit<DrawerProps, 'children'> {
  // onSelect?: (vaultId: string) => void;
}

const NotificationsDrawer = ({ ...props }: NotificationsDrawerProps) => {
  const {
    unreadCounter,
    inView,
    notificationsListRequest: {
      notifications,
      isSuccess,
      isFetching,
      isLoading,
    },
    onSelectNotification,
    drawer,
  } = useAppNotifications({
    onClose: props.onClose,
    isOpen: props.isOpen,
    // onSelect: props.onSelect,
  });

  const loading = isFetching || isLoading;
  const emptyState =
    isSuccess && !isLoading && !isFetching && notifications?.length === 0;

  return (
    <Drawer
      {...props}
      size="sm"
      variant="glassmorphic"
      placement="right"
      onClose={drawer.onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <Flex mb={5} w="full" justifyContent="flex-end">
          <HStack cursor="pointer" onClick={drawer.onClose} spacing={2}>
            <ErrorIcon />
            <Text fontWeight="semibold" color="white">
              Close
            </Text>
          </HStack>
        </Flex>

        <DrawerHeader mb={6}>
          <VStack alignItems="flex-start" spacing={2}>
            <HStack spacing={2} alignItems="center">
              <Heading fontSize="xl" fontWeight="semibold" color="grey.200">
                Notifications
              </Heading>
              {unreadCounter > 0 && (
                <Center px={1} py={0} bg="error.600" borderRadius={10}>
                  <Text fontSize="xs">+{unreadCounter}</Text>
                </Center>
              )}
            </HStack>
            <Text maxWidth={300} variant="description">
              {`Stay informed about all the activities happening in the vaults you're a part of.`}
            </Text>
          </VStack>
        </DrawerHeader>

        <DrawerBody
          borderTop="1px"
          borderTopColor="dark.100"
          py={isSuccess && !notifications.length ? 0 : 8}
          css={{
            '::-webkit-scrollbar': { width: 0 },
            scrollbarWidth: 'none',
          }}
        >
          {emptyState && <NotificationsEmptyState />}

          <VStack spacing={8}>
            {loading &&
              Array(3)
                .fill('')
                .map((_, i) => <CustomSkeleton key={i} h={32} w="full" />)}

            {!loading &&
              !emptyState &&
              notifications.length > 0 &&
              notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onSelectNotification={onSelectNotification}
                />
              ))}
            <Box ref={inView.ref} />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export { NotificationsDrawer };
