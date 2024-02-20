import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
} from '@chakra-ui/react';

import { UserIcon } from '../icons/user';

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
      <Icon fontSize={100} as={UserIcon} />
    </Box>
    <Box mb={5}>
      <Heading color="brand.500">{title}</Heading>
    </Box>
    <Box maxW={310} mb={5}>
      <Heading
        color="grey.200"
        fontSize="md"
        fontWeight="medium"
        textAlign="center"
      >
        You are changing user permissions from <strong>{oldPermission}</strong>{' '}
        to <strong>{newPermission}.</strong> Are you sure you want to update the
        user?
      </Heading>
    </Box>
    <Divider hidden={!showAction} my={8} borderColor="dark.100" />
    <HStack hidden={!showAction} spacing={4} justifyContent="center">
      <Button
        border="none"
        bgColor="dark.100"
        variant="secondary"
        onClick={onSecondaryAction}
      >
        {secondaryAction}
      </Button>
      <Button
        border="none"
        bgColor="brand.500"
        variant="primary"
        onClick={onPrimaryAction}
      >
        {primaryAction}
      </Button>
    </HStack>
  </Center>
);

export { FeedbackUpdate };
