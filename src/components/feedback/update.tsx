import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  Separator,
  Text,
  VStack,
} from 'bako-ui';

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
}: UpdateStepProps) => {
  return (
    <Flex
      flexDirection="column"
      mb={5}
      pt={{ xs: 40, sm: 'unset' }}
      pb={{ base: 0, sm: 5 }}
      h={{ base: 600, xs: 500, sm: 'unset' }}
    >
      <Box m={8}>
        <Icon fontSize={100} as={UserWorkspaceIcon} />
      </Box>
      <Box mb={5}>
        <Heading color="white">{title}</Heading>
      </Box>
      <Box maxW={420} mb={5}>
        <Text color="grey.400" textAlign="center">
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
      <VStack
        mt={{ base: 'auto', sm: 8 }}
        w={{ base: '80%' }}
        position={{ base: 'absolute', sm: 'unset' }}
        bottom={4}
      >
        <Separator
          maxW={440}
          hidden={!showAction}
          mb={8}
          borderColor="dark.100"
        />
        <HStack w="full" hidden={!showAction} gap={4} justifyContent="center">
          <Button
            w="45%"
            border="1px solid white"
            bgColor="transparent"
            variant="outline"
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
            onClick={onPrimaryAction}
            _hover={{
              opacity: 0.8,
            }}
          >
            {primaryAction}
          </Button>
        </HStack>
      </VStack>
    </Flex>
  );
};

export { FeedbackUpdate };
