import {
  Box,
  Center,
  Drawer,
  Heading,
  HStack,
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react';

import { CustomSkeleton, LineCloseIcon } from '@/components';

import { useAppNotifications } from '../../hooks';
import { NotificationsEmptyState } from '../emptyState';
import { NotificationCard } from '../notificationCard';

interface NotificationsDrawerProps extends Omit<Drawer.RootProps, 'children'> {}

const NotificationsDrawer = ({ ...props }: NotificationsDrawerProps) => {
  const {
    unreadCounter,
    inView,
    notificationsListRequest: { notifications, isSuccess, isLoading },
    onSelectNotification,
    drawer,
  } = useAppNotifications({
    onClose: props.onOpenChange
      ? () => props.onOpenChange?.({ open: false })
      : undefined,
    isOpen: props.open,
  });

  const hasNotifications = notifications.length >= 1;

  return (
    <Drawer.Root
      {...props}
      size="sm"
      // variant="solid-dark"
      placement="end"
      onOpenChange={drawer.onClose}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content p={10}>
            <Drawer.Header mb={6}>
              <VStack alignItems="flex-start" gap={4}>
                <HStack
                  gap={2}
                  alignItems="center"
                  justifyContent="space-between"
                  w="full"
                >
                  <HStack gap={2} alignItems="center">
                    <Heading
                      fontSize="lg"
                      fontWeight="semibold"
                      color="grey.50"
                    >
                      Notifications
                    </Heading>
                    {unreadCounter > 0 && (
                      <Center
                        minW={4}
                        minH={4}
                        maxW={9}
                        maxH={9}
                        bg="error.600"
                        borderRadius={10}
                        px={unreadCounter > 99 ? '0.5' : '0'}
                      >
                        <Text fontSize="xs">
                          {unreadCounter > 99 ? '+99' : unreadCounter}
                        </Text>
                      </Center>
                    )}
                  </HStack>
                  <LineCloseIcon
                    w="24px"
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
            </Drawer.Header>
            {hasNotifications ? (
              <Drawer.Body
                borderTop={!hasNotifications ? 0 : '1px'}
                borderTopColor="dark.100"
                py={isSuccess && !hasNotifications ? 0 : 8}
                css={{
                  '::-webkit-scrollbar': { width: 0 },
                  scrollbarWidth: 'none',
                }}
              >
                <CustomSkeleton loading={isLoading}>
                  <VStack gap={4}>
                    {notifications.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onSelectNotification={onSelectNotification}
                      />
                    ))}
                  </VStack>
                  <Box ref={inView.ref} />
                </CustomSkeleton>
              </Drawer.Body>
            ) : (
              <NotificationsEmptyState />
            )}
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export { NotificationsDrawer };
