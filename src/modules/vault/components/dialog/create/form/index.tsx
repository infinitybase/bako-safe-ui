import { Box, Tabs } from 'bako-ui';

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
  vaultNameAlreadyExists: UseCreateVaultDialogReturn['vaultNameAlreadyExists'];
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
    vaultNameAlreadyExists,
    validateAddress,
  } = props;

  const { template } = useFindTemplate();
  const stepAction = steps.step;
  const stepLength = Object.keys(steps.actions).length;

  return (
    <Box w="full" display="flex" flexDirection="column" flex={1}>
      <Box hidden={stepAction.hide} mb={6} mt={3}>
        <StepProgress length={stepLength - 1} value={tabs.tab} />
      </Box>
      <Tabs.Root value={String(tabs.tab)} flex={1}>
        <Tabs.Content value="0" pt={0} h="full">
          <VaultInfosStep
            form={form}
            vaultName={{
              search,
              setSearch,
              vaultNameAlreadyExists,
              searchHandler: handleInputChange,
            }}
          />
        </Tabs.Content>
        <Tabs.Content value="1" pt={0} h="full">
          <VaultAddressesStep
            form={form}
            addresses={addresses}
            templates={template}
            selectedTemplate={selectedTemplate}
            setTemplate={setTemplate}
            validateAddress={validateAddress}
          />
        </Tabs.Content>
        <Tabs.Content value="2" pt={0} h="full">
          <VaultSuccessStep />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

export { CreateVaultForm };
