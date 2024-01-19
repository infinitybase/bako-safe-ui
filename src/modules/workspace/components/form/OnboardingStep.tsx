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

import { DappWarning } from '@/components';

interface OnboardingStepProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const OnboardingStep = (props: OnboardingStepProps) => (
  <Center flexDirection="column" mb={5}>
    <Box m={8}>
      <Icon fontSize={48} as={DappWarning} />
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
    <Box mb={5}>
      <Text color="grey.200" fontSize="md" textAlign="center">
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
          Manage members, create new vaults, create transaction and access
          everything.
        </Text>
      </HStack>
      <HStack>
        <Box w="100%" maxW="80px">
          <Badge variant="blue">Manager</Badge>
        </Box>
        <Text color="grey.200" fontSize="md">
          Can create new vaults, create transaction and access all vaults in the
          workspace.
        </Text>
      </HStack>
      <HStack>
        <Box w="100%" maxW="80px">
          <Badge variant="warning">Viewer</Badge>
        </Box>
        <Text color="grey.200" fontSize="md">
          Can only access and view the contents of all vaults in the workspace.
        </Text>
      </HStack>
    </VStack>
    <Box mb={5}>
      <Text color="grey.200" fontSize="md" textAlign="center">
        Additionally, as the vault creator (owner), you will have the ability to
        add and remove new members, as well as edit their permissions.
      </Text>
    </Box>
    <Box mb={5}>
      <Alert
        color="#FDD835"
        bgColor="#FDD8351A"
        borderWidth={1}
        borderRadius={8}
        borderColor="#FDD8351A"
      >
        <Text>
          <b>Important</b>: The members of the workspace are not automatically
          signers in a vault, and being a signer of a vault does not make
          someone a member of the workspace. These are separate entities with
          independent controls. If individuals are not members of the workspace,
          signers will only have access to the specific vaults they are assigned
          to, which will be displayed in their personal workspace.
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
      <Button color="grey.300" variant="primary" onClick={props.onConfirm}>
        Conclude
      </Button>
    </HStack>
  </Center>
);

export { OnboardingStep };
