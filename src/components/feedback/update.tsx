import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
  Link,
  Text,
} from '@chakra-ui/react';

import { UserWorkspaceIcon } from '../icons/user-workspace-icon';

interface UpdateStepProps {
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  primaryAction?: string;
  secondaryAction?: string;
  showAction?: boolean;
  title: string;
  description?: string;
  oldPermission?: string;
  newPermission?: string;
}

const FeedbackUpdate = ({
  title,
  showAction,
  oldPermission,
  newPermission,
  primaryAction,
  secondaryAction,
  onPrimaryAction,
  onSecondaryAction,
}: UpdateStepProps) => (
  <Center flexDirection="column" mb={5}>
    <Box m={8}>
      <Icon fontSize={100} as={UserWorkspaceIcon} />
    </Box>
    <Box mb={5}>
      <Heading color="white">{title}</Heading>
    </Box>
    <Box maxW={420} mb={5}>
      <Text variant="description" color="grey.400" textAlign="center">
        You are changing user permissions from{' '}
        <Text textDecor="none" color="white" as={Link}>
          {oldPermission}
        </Text>{' '}
        to{' '}
        <Text textDecor="none" as={Link} color="white">
          {newPermission}.
        </Text>{' '}
        Are you sure you want to update the user?
      </Text>
    </Box>
    <Divider maxW={440} hidden={!showAction} my={8} borderColor="dark.100" />
    <HStack w="full" hidden={!showAction} spacing={4} justifyContent="center">
      <Button
        w="45%"
        border="1px solid white"
        bgColor="transparent"
        variant="secondary"
        onClick={onSecondaryAction}
        _hover={{
          borderColor: 'brand.500',
          color: 'brand.500',
        }}
      >
        {secondaryAction}
      </Button>
      <Button
        w="45%"
        border="none"
        bgColor="brand.500"
        variant="primary"
        onClick={onPrimaryAction}
        _hover={{
          opacity: 0.8,
        }}
      >
        {primaryAction}
      </Button>
    </HStack>
  </Center>
);

export { FeedbackUpdate };
