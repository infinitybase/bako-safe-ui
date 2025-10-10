import {
  Box,
  Button,
  Center,
  Separator,
  Heading,
  HStack,
  Icon,
} from '@chakra-ui/react';

import { SquarePlusIcon } from '@/components';
import { TransactionsBoxIcon } from '@/components/icons/transactions-box-icon';

interface SuccessStepProps {
  onConfigureMembers: () => void;
  onGoToWorkspace: () => void;
}

const SuccesStep = (props: SuccessStepProps) => (
  <Center flexDirection="column" mb={5}>
    <Box m={8}>
      <Icon fontSize={100} as={TransactionsBoxIcon} />
    </Box>
    <Box mb={5}>
      <Heading color="brand.500">All set!!</Heading>
    </Box>
    <Box maxW={310} mb={5}>
      <Heading color="grey.200" fontSize="md" textAlign="center">
        The vault template is now ready for use whenever you need to stramline
        your workflow!
      </Heading>
    </Box>
    <Separator m={4} borderColor="dark.100" />
    <HStack gap={4} justifyContent="center">
      <Button
        border="none"
        bgColor="dark.100"
        variant="secondary"
        onClick={props.onConfigureMembers}
      >
        Configure Members
      </Button>
      <Button
        color="grey.300"
        variant="primary"
        onClick={props.onGoToWorkspace}
        leftIcon={<SquarePlusIcon fontSize={18} />}
      >
        Conclude
      </Button>
    </HStack>
  </Center>
);

export { SuccesStep };
