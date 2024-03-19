import { useCallback } from 'react';

import { TabState, useCreateVault } from './useCreateVault';

export interface UseCreateVaultDialogProps {
  onClose: () => void;
}

export type UseCreateVaultDialogReturn = ReturnType<
  typeof useCreateVaultDialog
>;

const useCreateVaultDialog = (props: UseCreateVaultDialogProps) => {
  const { form, tabs, vaultNameIsAvailable, ...rest } = useCreateVault();

  const handleCancel = useCallback(() => {
    props.onClose();
    form.reset();
    tabs.set(TabState.INFO);
  }, [form, props, tabs]);

  const stepActions = {
    [TabState.INFO]: {
      hide: false,
      disable: form.watch('name').length === 0 || vaultNameIsAvailable,
      onContinue: () => tabs.set(TabState.ADDRESSES),
      description:
        'Define the name and description of this vault. These details will be visible to all members.',
      onCancel: handleCancel,
      closeText: 'Cancel',
      nextStepText: 'Continue',
    },
    [TabState.ADDRESSES]: {
      hide: false,
      disable: !form.formState.isValid,
      onContinue: form.handleCreateVault,
      description:
        'Define the details of your vault. Set up this rules carefully because it cannot be changed later.',
      onCancel: () => tabs.set(TabState.INFO),
      closeText: 'Cancel',
      nextStepText: 'Create Vault',
    },
    [TabState.SUCCESS]: {
      hide: true,
      disable: false,
      description: null,
      onContinue: () => {},
      onCancel: handleCancel,
      closeText: `I'll do it later`,
      nextStepText: '',
    },
  };

  return {
    form,
    tabs,
    handleCancel,
    steps: {
      step: stepActions[tabs.tab],
      actions: stepActions,
    },
    vaultNameIsAvailable,
    ...rest,
  };
};

export { useCreateVaultDialog };
