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
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';

import { ErrorIcon } from '@/components';
import { Notification } from '@/modules/core';

import { NotificationFilter, useAppNotifications } from '../../hooks';
import { NotificationsFilter } from '../filter';
import { NotificationCard } from '../notificationCard';

interface NotificationsDrawerProps extends Omit<DrawerProps, 'children'> {}

const notificationMock: Notification = {
  id: 'ksudyfgaeufgjk',
  title: 'Transaction error',
  createdAt: 'Mon, 18th Sep, 10:12 am',
  read: false,
  description:
    'Setting Sail on a Journey to Unlock the Potential of User-Centered Design.',
};

const NotificationsDrawer = (props: NotificationsDrawerProps) => {
  const { unreadCounter, filter, search, inView } = useAppNotifications();

  // TODO: Remove this when task is complete
  const notifications = Array(4).fill(notificationMock);

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

        {/* FILTER */}
        <NotificationsFilter.Control
          value={filter.value}
          onChange={(value) => filter.set(value as NotificationFilter)}
        >
          <NotificationsFilter.Field
            value={NotificationFilter.ALL}
            label="All"
          />
          <NotificationsFilter.Field
            value={NotificationFilter.UNREAD}
            label="Unread"
          />
          <NotificationsFilter.Field
            value={NotificationFilter.READ}
            label="Read"
          />
        </NotificationsFilter.Control>

        <Box w="100%" mb={8} mt={6}>
          <FormControl>
            <Input
              placeholder=" "
              variant="custom"
              colorScheme="dark"
              onChange={search.handler}
            />
            <FormLabel>Search</FormLabel>
            {/* It is important that the Label comes after the Control due to css selectors */}
          </FormControl>
        </Box>

        <DrawerBody
          py={8}
          borderTop="1px"
          borderTopColor="dark.100"
          css={{
            '::-webkit-scrollbar': { width: 0 },
            scrollbarWidth: 'none',
          }}
        >
          {/* {isSuccess && !notifications.length && (
            <Text variant="variant">
              We {"couldn't"} find any results for <b>“{search.value}”</b> in
              the vault.
            </Text>
          )} */}
          <VStack spacing={8}>
            {/* {!notifications.length && isFetching && (
              <CustomSkeleton h="90px" w="full" />
            )} */}

            {notifications.map((notification) => (
              // <CustomSkeleton key={notification.id} isLoaded={!isLoading}>
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
              // </CustomSkeleton>
            ))}
            <Box ref={inView.ref} />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export { NotificationsDrawer };
