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
import React from 'react';

import { VaultSuccessIcon } from '@/components';
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
          <Icon fontSize={100} as={VaultSuccessIcon} />
        </Box>
        <Box mb={5}>
          <Heading color="brand.600">All set!!</Heading>
        </Box>
        <Box mb={5}>
          <Heading color="grey.200" fontSize="md" textAlign="center">
            The vault has been created! Ready for the next steps?
          </Heading>
        </Box>
      </Center>

      <VStack>
        <HStack w="full" justifyContent="space-between">
          <Box w="full" maxW={190}>
            <Text variant="description">
              Unlock Vault Features: Start Your First Deposit
            </Text>
          </Box>
          <Button onClick={onDeposit} variant="primary" size="sm">
            First deposit
          </Button>
        </HStack>
        <HStack w="full" justifyContent="space-between">
          <Box w="full" maxW={190}>
            <Text variant="description">
              Streamline Your Workflow: Set this vault as Template
            </Text>
          </Box>
          <Button variant="primary" size="sm" onClick={onSaveTemplate}>
            Set as template
          </Button>
        </HStack>
      </VStack>
    </TabPanel>
  );
};

export { VaultSuccessStep };
