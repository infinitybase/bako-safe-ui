import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
} from '@chakra-ui/react';

import { SquarePlusIcon, VaultSuccessIcon } from '../icons';

interface SuccessStepProps {
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  showAction?: boolean;
  title: string;
  description: string;
}

const FeedbackSuccess = ({
  title,
  showAction,
  description,
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
    <Divider hidden={!showAction} m={4} borderColor="dark.100" />
    <HStack hidden={!showAction} spacing={4} justifyContent="center">
      <Button
        border="none"
        bgColor="dark.100"
        variant="secondary"
        onClick={onPrimaryAction}
      >
        Configure Members
      </Button>
      <Button
        color="grey.300"
        variant="primary"
        onClick={onSecondaryAction}
        leftIcon={<SquarePlusIcon fontSize={18} />}
      >
        Conclude
      </Button>
    </HStack>
  </Center>
);

export { FeedbackSuccess };
