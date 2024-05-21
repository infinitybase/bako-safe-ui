import { useCallback } from 'react';

import { useAuth, useQueryParams } from '@/modules/auth';
import { useCreateConnections } from '@/modules/dapp/hooks/useCreateConnection';

import { TabState, useCreateVault } from './useCreateVault';

export interface UseCreateVaultDialogProps {
  onClose: () => void;
}

export type UseCreateVaultDialogReturn = ReturnType<
  typeof useCreateVaultDialog
>;

const useCreateVaultDialog = (props: UseCreateVaultDialogProps) => {
  const { form, tabs, vaultNameIsAvailable, vaultId, ...rest } =
    useCreateVault();
  const { name, origin, sessionId, request_id } = useQueryParams();
  const createConnectionsMutation = useCreateConnections();
  const auth = useAuth();

  const handleCancel = useCallback(() => {
    props.onClose();
  }, [form, props, tabs]);

  const close = (close_call: () => void, step?: TabState) => () => {
    const isValid = sessionId && name && origin && request_id;

    if (step && step == TabState.SUCCESS && isValid) {
      createConnectionsMutation.mutate({
        sessionId: sessionId!,
        name: name!,
        origin: origin!,
        request_id: request_id!,
        userAddress: auth.account,
        vaultId: vaultId,
      });
    }
    tabs.set(TabState.INFO);

    return close_call();
  };

  const stepActions = {
    [TabState.INFO]: {
      hide: false,
      disable: form.watch('name').length === 0 || vaultNameIsAvailable,
      onContinue: () => tabs.set(TabState.ADDRESSES),
      description:
        'Define the name and description of this vault. These details will be visible to all members.',
      onCancel: close(handleCancel),
      closeText: 'Cancel',
      nextStepText: 'Continue',
    },
    [TabState.ADDRESSES]: {
      hide: false,
      disable: !form.formState.isValid,
      onContinue: form.handleCreateVault,
      description:
        'Define the details of your vault. Set up this rules carefully because it cannot be changed later.',
      onCancel: close(() => tabs.set(TabState.INFO)),
      closeText: 'Cancel',
      nextStepText: 'Create Vault',
    },
    [TabState.SUCCESS]: {
      hide: true,
      disable: false,
      description: null,
      onContinue: () => {},
      onCancel: close(handleCancel, TabState.SUCCESS), // window close to connector
      closeText: `Done`,
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
