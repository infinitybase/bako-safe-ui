import { Box, TabPanels, Tabs } from '@chakra-ui/react';
import React from 'react';

import { StepProgress } from '@/components';
import { UseCreateVaultDialogReturn } from '@/modules';
import { useFindTemplate } from '@/modules/template/hooks';

import { VaultAddressesStep, VaultInfosStep, VaultSuccessStep } from './steps';

export interface CreateVaultFormProps {
  tabs: UseCreateVaultDialogReturn['tabs'];
  form: UseCreateVaultDialogReturn['form'];
  addresses: UseCreateVaultDialogReturn['addresses'];
  onDeposit: UseCreateVaultDialogReturn['onDeposit'];
  setTemplate: UseCreateVaultDialogReturn['setFormWithTemplate'];
  steps: UseCreateVaultDialogReturn['steps'];
  isLoading?: boolean;
  onCancel: () => void;
}

const CreateVaultForm = (props: CreateVaultFormProps) => {
  const { form, tabs, addresses, onDeposit, steps, setTemplate } = props;

  const { template } = useFindTemplate();
  const stepAction = steps.step;
  const stepLength = Object.keys(steps.actions).length;

  return (
    <Box w="full" maxW={420}>
      <Box hidden={stepAction.hide} mb={12}>
        <StepProgress length={stepLength} value={tabs.tab} />
      </Box>
      <Tabs index={tabs.tab} colorScheme="green">
        <TabPanels>
          <VaultInfosStep form={form} />
          <VaultAddressesStep
            form={form}
            addresses={addresses}
            templates={template}
            setTemplate={setTemplate}
          />
          <VaultSuccessStep onDeposit={onDeposit} />
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export { CreateVaultForm };
