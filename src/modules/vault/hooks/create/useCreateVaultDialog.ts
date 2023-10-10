import { useCallback } from 'react';

import { TabState, useCreateVault } from './useCreateVault';

export interface UseCreateVaultDialogProps {
  onClose: () => void;
}

export type UseCreateVaultDialogReturn = ReturnType<
  typeof useCreateVaultDialog
>;

const useCreateVaultDialog = (props: UseCreateVaultDialogProps) => {
  const { form, tabs, ...rest } = useCreateVault();

  const handleCancel = useCallback(() => {
    props.onClose();
    form.reset();
    tabs.set(TabState.INFO);
  }, [form, props, tabs]);

  const stepActions = {
    [TabState.INFO]: {
      hide: false,
      disable: !form.watch('name'),
      onContinue: () => tabs.set(TabState.ADDRESSES),
      onCancel: handleCancel,
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
      onCancel: handleCancel,
      closeText: `I'll do it later`,
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
    ...rest,
  };
};

export { useCreateVaultDialog };
