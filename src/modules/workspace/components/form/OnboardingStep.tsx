import {
  Alert,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';

import { DappWarning, SquarePlusIcon, StepProgress } from '@/components';

interface OnboardingStepProps {
  tabs: {
    tab: number;
    is: (value: number) => boolean;
    set: React.Dispatch<React.SetStateAction<number>>;
    length: number;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

const OnboardingStep = (props: OnboardingStepProps) => (
  <Center flexDirection="column" mb={5}>
    <Box m={8}>
      <Icon fontSize={100} as={DappWarning} />
    </Box>
    <Box mb={5}>
      <Heading>Heads up!!</Heading>
    </Box>
    <Box maxW={400} mb={5}>
      <Text color="grey.200" fontSize="md" textAlign="center">
        Before creating your first workspace, {`it's`} crucial <br />
        to understand how they function.
      </Text>
    </Box>
    <Box w="100%" my={5}>
      <StepProgress value={props.tabs.tab} length={props.tabs.length} />
    </Box>
    <Box mb={5}>
      <Text color="grey.200" fontSize="md" textAlign="start">
        Workspaces are shared spaces that allow multiple people to access the
        same vaults and address book. Within a workspace, you can assign users
        different levels of permission, including:
      </Text>
    </Box>
    <VStack mb={5}>
      <HStack>
        <Box w="100%" maxW="80px">
          <Badge variant="success">Admin</Badge>
        </Box>
        <Text color="grey.200" fontSize="md">
          <Text as="span" fontWeight="bold">
            Manage members, create new vaults, create transactions
          </Text>{' '}
          and access everything.
        </Text>
      </HStack>
      <HStack>
        <Box w="100%" maxW="80px">
          <Badge variant="yellow">Manager</Badge>
        </Box>

        <Text color="grey.200" fontSize="md">
          <Text as="span" fontWeight="bold">
            Can create new vaults, create transaction and access all vaults
          </Text>{' '}
          in the workspace.
        </Text>
      </HStack>
      <HStack>
        <Box w="100%" maxW="80px">
          <Badge variant="blue">Viewer</Badge>
        </Box>
        <Text color="grey.200" fontSize="md">
          Can only{' '}
          <Text as="span" fontWeight="bold">
            access and view
          </Text>{' '}
          the contents of all vaults in the workspace.
        </Text>
      </HStack>
    </VStack>

    <Box mb={5}>
      <Alert
        color="#FDD835"
        bgColor="#FDD8351A"
        borderWidth={1}
        borderRadius={8}
        borderColor="#FDD8351A"
      >
        <Text fontSize="lg">
          <b>Important Note</b>: Membership in the workspace ≠ signatory rights
          in a vault. They are separate entities with separate controls.
        </Text>
      </Alert>
    </Box>
    <Divider m={4} borderColor="dark.100" />
    <HStack spacing={4} justifyContent="center">
      <Button
        border="none"
        bgColor="dark.100"
        variant="secondary"
        onClick={props.onCancel}
      >
        Cancel
      </Button>
      <Button
        color="grey.300"
        variant="primary"
        onClick={props.onConfirm}
        leftIcon={<SquarePlusIcon fontSize={18} />}
      >
        Create workspace
      </Button>
    </HStack>
  </Center>
);

export { OnboardingStep };
