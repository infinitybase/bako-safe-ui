import {
  Box,
  Center,
  Drawer,
  DrawerRootProps,
  Heading,
  HStack,
  Portal,
  Text,
  VStack,
} from 'bako-ui';

import { CustomSkeleton, LineCloseIcon } from '@/components';

import { useAppNotifications } from '../../hooks';
import { NotificationsEmptyState } from '../emptyState';
import { NotificationCard } from '../notificationCard';

interface NotificationsDrawerProps extends Omit<DrawerRootProps, 'children'> {}

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
      placement="end"
      onOpenChange={drawer.onClose}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content p={6}>
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
                      fontSize="xl"
                      fontWeight="semibold"
                      color="textPrimary"
                    >
                      Notifications
                    </Heading>
                    {unreadCounter > 0 && (
                      <Center
                        bg="red"
                        minW="16px"
                        h="16px"
                        borderRadius="full"
                        px={unreadCounter > 99 ? '0.5' : '0'}
                      >
                        <Text
                          fontSize="2xs"
                          color="gray.50"
                          fontWeight="bold"
                          lineHeight="shorter"
                        >
                          {unreadCounter > 99 ? '+99' : unreadCounter}
                        </Text>
                      </Center>
                    )}
                  </HStack>

                  <Drawer.CloseTrigger position="static">
                    <LineCloseIcon
                      w="24px"
                      aria-label="Close window"
                      cursor="pointer"
                    />
                  </Drawer.CloseTrigger>
                </HStack>
                <Text fontSize="md" color="textSecondary" lineHeight={1.21}>
                  Stay informed about all the activities happening in the vaults
                  that you are part of
                </Text>
              </VStack>
            </Drawer.Header>
            {hasNotifications ? (
              <Drawer.Body
                borderTop="1px solid"
                borderTopColor="gray.400"
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
