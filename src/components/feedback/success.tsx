import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
} from '@chakra-ui/react';

import { VaultSuccessIcon } from '../icons';

interface SuccessStepProps {
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  primaryAction?: string;
  secondaryAction?: string;
  showAction?: boolean;
  title: string;
  description: string;
}

const FeedbackSuccess = ({
  title,
  showAction,
  description,
  primaryAction,
  secondaryAction,
  onPrimaryAction,
  onSecondaryAction,
}: SuccessStepProps) => (
  <Center flexDirection="column" mb={5}>
    <Box m={8}>
      <Icon fontSize={100} as={VaultSuccessIcon} />
    </Box>
    <Box mb={5}>
      <Heading color="brand.600">{title}</Heading>
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
        bgColor="dark.100"
        variant="secondary"
        onClick={onPrimaryAction}
      >
        {primaryAction}
      </Button>
    </HStack>
  </Center>
);

export { FeedbackSuccess };
