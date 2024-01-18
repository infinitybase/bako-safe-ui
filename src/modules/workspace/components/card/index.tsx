import {
  Avatar,
  Box,
  Card,
  CardProps,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Workspace } from '@/modules/core';

interface NotificationCardProps extends CardProps {
  workspace: Workspace;
  // onSelectNotification: (summary: NotificationSummary) => void;
}

const WorkspaceCard = ({
  workspace: { name, description },
  // onSelectNotification,
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
      // onClick={() => onSelectNotification(summary)}
      px={6}
      py={4}
      {...rest}
    >
      <HStack alignItems="center" justifyContent="space-between">
        <Avatar></Avatar>
        <VStack>
          <Text fontWeight="bold" color="grey.200">
            {name}
          </Text>
          <Text fontWeight="bold" color="grey.200">
            {description}
          </Text>
        </VStack>
      </HStack>

      <Box mb={2}>
        <Text variant="description" fontSize={14}>
          Um
        </Text>
      </Box>

      {/* <Text color="grey.500" variant="description" fontSize={14}>
        {notificationDescription(title, summary)}
      </Text> */}
    </Card>
  );
};

export { WorkspaceCard };
