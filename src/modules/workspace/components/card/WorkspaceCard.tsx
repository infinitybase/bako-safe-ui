import { Avatar, Card, HStack, Text, VStack } from '@chakra-ui/react';

import { Workspace } from '@/modules/core';

import { useWorkspaceContext } from '../../WorkspaceProvider';

interface NotificationCardProps extends Card.RootProps {
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

  const {
    screenSizes: { isExtraSmall },
  } = useWorkspaceContext();

  return (
    <Card.Root
      w="100%"
      bgColor="grey.825"
      cursor="pointer"
      borderColor="grey.550"
      borderWidth="1px"
      borderRadius={10}
      alignItems="flex-start"
      justifyContent="center"
      maxH={88}
      px={{ base: 3, sm: 6 }}
      py={4}
      {...rest}
    >
      <HStack gap={4} alignItems="center" h="56px">
        <Avatar.Root shape="rounded" boxSize={isExtraSmall ? '40px' : '56px'}>
          <Avatar.Image src={avatar} />
        </Avatar.Root>

        <VStack
          flex={1}
          alignItems="flex-start"
          justifyContent="space-between"
          h="full"
        >
          <VStack
            alignItems="flex-start"
            justifyContent="space-between"
            gap={0}
          >
            <Text
              fontWeight="bold"
              color="grey.200"
              maxW={{ base: 150, sm: 360 }}
              truncate
              fontSize={14}
              height="fit-content"
              lineHeight="17px"
            >
              {name}
            </Text>
            <Text
              color="grey.500"
              fontWeight="normal"
              fontSize={14}
              truncate
              lineHeight="19px"
              maxW={{ base: 130, sm: 340 }}
            >
              {description}
            </Text>
          </VStack>

          <Text
            fontSize={14}
            color="grey.200"
            mt={!description ? 'unset' : '-20px'}
          >
            {`${counter.vaults} vaults and ${counter.members} members`}
          </Text>
        </VStack>
      </HStack>
    </Card.Root>
  );
};

export { WorkspaceCard };
