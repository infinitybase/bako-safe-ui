import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Icon,
  TabPanel,
  Text,
  VStack,
} from '@chakra-ui/react';

import { UserWorkspaceIcon } from '@/components/icons/user-workspace-icon';
import { UseCreateVaultDialogReturn } from '@/modules/vault/hooks';

interface VaultSuccessStepProp {
  onDeposit: () => void;
  onSaveTemplate: UseCreateVaultDialogReturn['onSaveTemplate'];
}

const VaultSuccessStep = ({
  onDeposit,
  onSaveTemplate,
}: VaultSuccessStepProp) => {
  return (
    <TabPanel>
      <Center flexDirection="column" mb={5}>
        <Box mb={8}>
          <Icon fontSize={100} as={UserWorkspaceIcon} />
        </Box>
        <Box mb={5}>
          <Heading fontSize="3xl" color="white">
            All set!!
          </Heading>
        </Box>
        <Box mb={5}>
          <Heading
            fontWeight="normal"
            color="grey.400"
            fontSize="md"
            textAlign="center"
          >
            The vault has been created! Ready for the next steps?
          </Heading>
        </Box>
      </Center>

      <VStack>
        <HStack w="full" justifyContent="space-between">
          <Box w="full" maxW={190}>
            <Text variant="description">
              <Text color="grey.200" fontWeight="semibold">
                Unlock Vault Features:
              </Text>
              Use the faucet
            </Text>
          </Box>
          <Button
            _hover={{
              opacity: 0.8,
            }}
            h={9}
            onClick={onDeposit}
            variant="primary"
            size="sm"
          >
            Give me Ether
          </Button>
        </HStack>
        <HStack w="full" justifyContent="space-between">
          <Box w="full" maxW={190}>
            <Text variant="description">
              <Text color="grey.200" fontWeight="semibold">
                Streamline Your Workflow:
              </Text>
              Set this vault as Template
            </Text>
          </Box>
          <Button
            _hover={{
              opacity: 0.8,
            }}
            h={9}
            variant="primary"
            size="sm"
            onClick={onSaveTemplate}
          >
            Set as template
          </Button>
        </HStack>
      </VStack>
    </TabPanel>
  );
};

export { VaultSuccessStep };
