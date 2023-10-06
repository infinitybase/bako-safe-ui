import {
  Box,
  Heading,
  Progress,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

import { TabState, UseCreateVaultReturn } from '@/modules';

import { VaultFormActions } from './actions';
import { VaultAddressesStep, VaultInfosStep } from './steps';

export interface CreateVaultFormProps {
  tabs: UseCreateVaultReturn['tabs'];
  form: UseCreateVaultReturn['form'];
  addresses: UseCreateVaultReturn['addresses'];
  isLoading?: boolean;
}

const CreateVaultForm = ({ form, tabs, addresses }: CreateVaultFormProps) => {
  const stepActions = {
    [TabState.INFO]: {
      disable: !form.watch('name'),
      onContinue: () => tabs.set(TabState.ADDRESSES),
    },
    [TabState.ADDRESSES]: {
      disable: !form.formState.isValid,
      onContinue: () => console.log('ok'),
    },
  };

  const stepAction = stepActions[tabs.tab];

  return (
    <Box w="full" as="form" maxW={420} onSubmit={form.handleCreateVault}>
      <VStack spacing={4} alignItems="flex-start">
        <Heading fontSize="2xl" color="grey.200">
          Create Vault
        </Heading>
        <Text variant="description">
          Setting Sail on a Journey to Unlock the Potential of User-Centered
          Design.
        </Text>
      </VStack>

      <Box my={12}>
        <Progress value={50} size="xs" colorScheme="brand" bgColor="dark.200" />
      </Box>

      <Tabs index={tabs.tab} colorScheme="green">
        <TabPanels>
          <VaultInfosStep form={form} />
          <VaultAddressesStep form={form} addresses={addresses} />
        </TabPanels>
      </Tabs>

      <VaultFormActions
        onCancel={() => console.log('cancel')}
        onContinue={stepAction?.onContinue}
        isDisabled={stepAction?.disable}
      />
    </Box>
  );
};

export { CreateVaultForm };
