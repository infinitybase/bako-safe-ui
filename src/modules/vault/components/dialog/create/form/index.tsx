import { Box, TabPanels, Tabs } from '@chakra-ui/react';

import { StepProgress } from '@/components';
import { useFindTemplate } from '@/modules/template/hooks';
import { UseCreateVaultDialogReturn } from '@/modules/vault';

import { VaultAddressesStep, VaultInfosStep, VaultSuccessStep } from './steps';

export interface CreateVaultFormProps {
  tabs: UseCreateVaultDialogReturn['tabs'];
  form: UseCreateVaultDialogReturn['form'];
  addresses: UseCreateVaultDialogReturn['addresses'];
  onDeposit: UseCreateVaultDialogReturn['onDeposit'];
  onSaveTemplate: UseCreateVaultDialogReturn['onSaveTemplate'];
  selectedTemplate: UseCreateVaultDialogReturn['selectedTemplate'];
  setTemplate: UseCreateVaultDialogReturn['setFormWithTemplate'];
  steps: UseCreateVaultDialogReturn['steps'];
  isLoading?: boolean;
  onCancel: () => void;
  vaultNameIsAvailable: UseCreateVaultDialogReturn['vaultNameIsAvailable'];
  search: UseCreateVaultDialogReturn['search'];
  setSearch: UseCreateVaultDialogReturn['setSearch'];
  handleInputChange: UseCreateVaultDialogReturn['handleInputChange'];
  validateAddress: UseCreateVaultDialogReturn['validateAddress'];
}

const CreateVaultForm = (props: CreateVaultFormProps) => {
  const {
    form,
    tabs,
    addresses,
    steps,
    selectedTemplate,
    setTemplate,
    search,
    setSearch,
    handleInputChange,
    vaultNameIsAvailable,
    validateAddress,
  } = props;

  const { template } = useFindTemplate();
  const stepAction = steps.step;
  const stepLength = Object.keys(steps.actions).length;

  return (
    <Box w="full">
      <Box hidden={stepAction.hide} mb={6} mt={{ sm: 8 }}>
        <StepProgress length={stepLength} value={tabs.tab} />
      </Box>
      <Tabs index={tabs.tab} colorScheme="green">
        <TabPanels>
          <VaultInfosStep
            form={form}
            vaultName={{
              search,
              setSearch,
              vaultNameIsAvailable,
              searchHandler: handleInputChange,
            }}
          />
          <VaultAddressesStep
            form={form}
            addresses={addresses}
            templates={template}
            selectedTemplate={selectedTemplate}
            setTemplate={setTemplate}
            validateAddress={validateAddress}
          />
          <VaultSuccessStep />
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export { CreateVaultForm };
