import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
} from '@chakra-ui/react';

import { DeleteUserIcon } from '../icons/delete-user';

interface DeleteStepProps {
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  primaryAction?: string;
  secondaryAction?: string;
  showAction?: boolean;
  title: string;
  description: string;
}

const FeedbackDelete = ({
  title,
  showAction,
  description,
  primaryAction,
  secondaryAction,
  onPrimaryAction,
  onSecondaryAction,
}: DeleteStepProps) => (
  <Center flexDirection="column" mb={5}>
    <Box m={8}>
      <Icon fontSize={100} as={DeleteUserIcon} />
    </Box>
    <Box mb={5}>
      <Heading color="error.500">{title}</Heading>
    </Box>
    <Box maxW={310} mb={5}>
      <Heading color="grey.200" fontSize="md" textAlign="center">
        {description}
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
        bgColor="error.500"
        variant="primary"
        onClick={onPrimaryAction}
      >
        {primaryAction}
      </Button>
    </HStack>
  </Center>
);

export { FeedbackDelete };
