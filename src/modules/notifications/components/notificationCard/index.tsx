import { Box, Card, CardProps, HStack, Text } from 'bako-ui';
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
    <Card.Root
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
        <Box w={3} h={3} rounded="full" bg={read ? 'grey.300' : 'error.600'} />
      </HStack>

      <Box mb={2}>
        <Text variant="description" fontSize={14}>
          {format(parseISO(createdAt), 'EEE, do MMM, h:mm a')}
        </Text>
      </Box>

      <Text color="grey.450" variant="description" fontSize={14}>
        {notificationDescription(title, summary)}
      </Text>
    </Card.Root>
  );
};

export { NotificationCard };
