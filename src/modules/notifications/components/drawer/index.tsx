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
import { useEffect } from 'react';

import { CustomSkeleton, LineCloseIcon } from '@/components';
import { createGTMCustomEvent } from '@/utils';

import { useAppNotifications } from '../../hooks';
import { NotificationsEmptyState } from '../emptyState';
import { NotificationCard } from '../notificationCard';

interface NotificationsDrawerProps extends Omit<DrawerProps, 'children'> {}

const NotificationsDrawer = ({
  isOpen,
  ...props
}: NotificationsDrawerProps) => {
  const {
    unreadCounter,
    inView,
    notificationsListRequest: { notifications, isSuccess, isLoading },
    onSelectNotification,
    drawer,
  } = useAppNotifications({
    onClose: props.onClose,
    isOpen: isOpen,
  });

  const hasNotifications = notifications.length >= 1;

  useEffect(() => {
    if (isOpen) {
      createGTMCustomEvent({
        eventName: 'open notifications drawer',
        buttonId: 'Home Vault: Open Notifications Header',
      });
    }
  }, [isOpen]);

  return (
    <Drawer
      {...props}
      isOpen={isOpen}
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
        {hasNotifications ? (
          <DrawerBody
            borderTop={!hasNotifications ? 0 : '1px'}
            borderTopColor="dark.100"
            py={isSuccess && !hasNotifications ? 0 : 8}
            sx={{
              '::-webkit-scrollbar': { width: 0 },
              scrollbarWidth: 'none',
            }}
          >
            <CustomSkeleton isLoaded={!isLoading}>
              <VStack spacing={4}>
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
          </DrawerBody>
        ) : (
          <NotificationsEmptyState />
        )}
      </DrawerContent>
    </Drawer>
  );
};

export { NotificationsDrawer };
