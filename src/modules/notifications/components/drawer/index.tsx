import {
  Box,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';

import { CustomSkeleton, LineCloseIcon } from '@/components';

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
      variant="solid-dark"
      placement="right"
      onClose={drawer.onClose}
    >
      <DrawerOverlay />
      <DrawerContent p={10}>
        <DrawerHeader mb={6}>
          <VStack alignItems="flex-start" spacing={4}>
            <HStack
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              w="full"
            >
              <HStack spacing={2} alignItems="center">
                <Heading fontSize="lg" fontWeight="semibold" color="grey.50">
                  Notifications
                </Heading>
                {unreadCounter > 0 && (
                  <Center
                    minW={4}
                    minH={4}
                    maxW={5}
                    maxH={5}
                    bg="error.600"
                    borderRadius={10}
                  >
                    <Text fontSize="xs">{unreadCounter}</Text>
                  </Center>
                )}
              </HStack>
              <LineCloseIcon
                fontSize="24px"
                aria-label="Close window"
                cursor="pointer"
                onClick={drawer.onClose}
              />
            </HStack>
            <Text
              fontSize="xs"
              color="grey.450"
              fontWeight={400}
              lineHeight={1.21}
            >
              {`Stay informed about all the activities happening in the vaults that you are part of.`}
            </Text>
          </VStack>
        </DrawerHeader>

        <DrawerBody
          borderTop={emptyState ? 0 : '1px'}
          borderTopColor="dark.100"
          py={isSuccess && !notifications.length ? 0 : 8}
          css={{
            '::-webkit-scrollbar': { width: 0 },
            scrollbarWidth: 'none',
          }}
        >
          {emptyState && <NotificationsEmptyState />}

          <VStack spacing={4}>
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
