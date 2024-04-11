import {
  Avatar,
  Card,
  CardProps,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Workspace } from '@/modules/core';

interface NotificationCardProps extends CardProps {
  workspace: Workspace;
  counter: {
    vaults: number | [];
    members: number;
  };
}

const WorkspaceCard = ({
  workspace,
  counter,
  ...rest
}: NotificationCardProps) => {
  const { name, description, avatar } = workspace;

  return (
    <Card
      w="100%"
      bgColor="dark.300"
      cursor="pointer"
      borderColor="dark.100"
      borderWidth="1px"
      borderRadius={10}
      alignItems="flex-start"
      justifyContent="center"
      minH={100}
      maxH={100}
      px={6}
      py={4}
      {...rest}
    >
      <HStack spacing={4} alignItems="center">
        <Avatar variant="roundedSquare" src={avatar} />

        <VStack flex={1} spacing={1.5} alignItems="flex-start">
          <Text
            fontWeight="bold"
            color="grey.200"
            maxW={{ base: 195, sm: 360 }}
            isTruncated
          >
            {name}
            <Text
              color="grey.500"
              fontWeight="normal"
              fontSize={14}
              noOfLines={2}
            >
              {description}
            </Text>
          </Text>

          <Text fontWeight="bold" fontSize={14} color="grey.200">
            {`${counter.vaults} vaults and ${counter.members} members`}
          </Text>
        </VStack>
      </HStack>
    </Card>
  );
};

export { WorkspaceCard };
