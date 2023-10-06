import { Box, Heading, TabPanels, Tabs, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import { TabState, UseCreateVaultReturn } from '@/modules';
import { VaultSuccessStep } from '@/modules/vault/components/dialog/create/form/steps/success';

import { VaultFormActions } from './actions';
import { VaultProgressForm } from './progress';
import { VaultAddressesStep, VaultInfosStep } from './steps';

export interface CreateVaultFormProps {
  tabs: UseCreateVaultReturn['tabs'];
  form: UseCreateVaultReturn['form'];
  addresses: UseCreateVaultReturn['addresses'];
  isLoading?: boolean;
  onCancel: () => void;
}

const CreateVaultForm = (props: CreateVaultFormProps) => {
  const { form, tabs, addresses, isLoading } = props;

  const stepActions = {
    [TabState.INFO]: {
      hide: false,
      disable: !form.watch('name'),
      onContinue: () => tabs.set(TabState.ADDRESSES),
      onCancel: props.onCancel,
      closeText: 'Cancel',
    },
    [TabState.ADDRESSES]: {
      hide: false,
      disable: !form.formState.isValid,
      onContinue: form.handleCreateVault,
      onCancel: () => tabs.set(TabState.INFO),
      closeText: 'Back',
    },
    [TabState.SUCCESS]: {
      hide: true,
      disable: false,
      onContinue: () => {},
      onCancel: props.onCancel,
      closeText: `I'll do it later`,
    },
  };

  const stepAction = stepActions[tabs.tab];
  const stepLength = Object.keys(stepActions).length;

  return (
    <Box w="full" as="form" maxW={420}>
      <VStack hidden={stepAction?.hide} spacing={4} alignItems="flex-start">
        <Heading fontSize="2xl" color="grey.200">
          Create Vault
        </Heading>
        <Text variant="description">
          Setting Sail on a Journey to Unlock the Potential of User-Centered
          Design.
        </Text>
      </VStack>

      <Box hidden={stepAction.hide} my={12}>
        <VaultProgressForm length={stepLength} value={tabs.tab} />
      </Box>

      <Tabs index={tabs.tab} colorScheme="green">
        <TabPanels>
          <VaultInfosStep form={form} />
          <VaultAddressesStep form={form} addresses={addresses} />
          <VaultSuccessStep />
        </TabPanels>
      </Tabs>

      <VaultFormActions
        onCancel={stepAction?.onCancel}
        closeText={stepAction?.closeText}
        isLoading={isLoading}
        isDisabled={stepAction?.disable}
        onContinue={stepAction?.onContinue}
        hideContinue={stepAction?.hide}
      />
    </Box>
  );
};

export { CreateVaultForm };
