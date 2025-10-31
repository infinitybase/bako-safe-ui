import { Box, Card, CardRootProps, HStack, Text } from 'bako-ui';
import { format, parseISO } from 'date-fns';

import { Notification, NotificationSummary } from '@/modules/core';

import { notificationDescription } from '../../utils';

interface NotificationCardProps extends CardRootProps {
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
      variant="subtle"
      bg="bg.muted"
      cursor="pointer"
      borderRadius="2xl"
      onClick={() => onSelectNotification(summary)}
      px={6}
      py={4}
      {...rest}
    >
      <HStack alignItems="center" justifyContent="space-between">
        <Text fontWeight="bold" color="textPrimary" fontSize="sm">
          {title}
        </Text>
        <Box w={3} h={3} rounded="full" bg={read ? 'gray.300' : 'red'} />
      </HStack>

      <Box mb={2}>
        <Text fontSize="xs" color="textSecondary">
          {format(parseISO(createdAt), 'EEE, do MMM, h:mm a')}
        </Text>
      </Box>

      <Text color="textSecondary" fontSize="xs">
        {notificationDescription(title, summary)}
      </Text>
    </Card.Root>
  );
};

export { NotificationCard };
