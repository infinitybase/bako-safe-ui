import { Box, Card, CardProps, HStack, Text } from '@chakra-ui/react';
import { format, parseISO } from 'date-fns';

import { Notification, NotificationSummary } from '@/modules/core';

import { notificationDescription } from '../../utils';

interface NotificationCardProps extends CardProps {
  notification: Notification;
  onSelectNotification: (summary: NotificationSummary) => void;
}

const NotificationCard = ({
  notification: { title, read, summary, createdAt },
  onSelectNotification,
  ...rest
}: NotificationCardProps) => {
  return (
    <Card
      w="100%"
      bgColor="dark.300"
      cursor="pointer"
      borderColor="dark.100"
      borderWidth="1px"
      borderRadius={10}
      onClick={() => onSelectNotification(summary)}
      px={6}
      py={4}
      {...rest}
    >
      <HStack alignItems="center" justifyContent="space-between">
        <Text fontWeight="bold" color="grey.200">
          {title}
        </Text>
        <Box w={4} h={4} rounded="full" bg={read ? 'grey.300' : 'brand.500'} />
      </HStack>

      <Box mb={2}>
        <Text variant="description" fontSize={14}>
          {format(parseISO(createdAt), 'EEE, do MMM, h:mm a')}
        </Text>
      </Box>

      <Text color="grey.500" variant="description" fontSize={14} noOfLines={2}>
        {notificationDescription(title, summary)}
      </Text>
    </Card>
  );
};

export { NotificationCard };
