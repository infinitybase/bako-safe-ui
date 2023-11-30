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
import { NotificationCard } from '../notificationCard';

interface NotificationsDrawerProps extends Omit<DrawerProps, 'children'> {}

const NotificationsDrawer = (props: NotificationsDrawerProps) => {
  const {
    unreadCounter,
    inView,
    notificationsListRequest: {
      notifications,
      isSuccess,
      isFetching,
      isLoading,
    },
    onNotificationClick,
  } = useAppNotifications();

  return (
    <Drawer size="sm" variant="glassmorphic" placement="right" {...props}>
      <DrawerOverlay />
      <DrawerContent>
        <Flex mb={5} w="full" justifyContent="flex-end">
          <HStack cursor="pointer" onClick={props.onClose} spacing={2}>
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
              Setting Sail on a Journey to Unlock the Potential of User-Centered
              Design.
            </Text>
          </VStack>
        </DrawerHeader>

        <DrawerBody
          py={8}
          borderTop="1px"
          borderTopColor="dark.100"
          css={{
            '::-webkit-scrollbar': { width: 0 },
            scrollbarWidth: 'none',
          }}
        >
          {isSuccess && !notifications.length && (
            <Text variant="variant">
              We {"couldn't"} find any notification.
            </Text>
          )}
          <VStack spacing={8}>
            {!notifications.length && isFetching && (
              <CustomSkeleton h="90px" w="full" />
            )}

            {notifications.map((notification) => (
              <CustomSkeleton key={notification.id} isLoaded={!isLoading}>
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onNotificationClick={onNotificationClick}
                />
              </CustomSkeleton>
            ))}
            <Box ref={inView.ref} />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export { NotificationsDrawer };
