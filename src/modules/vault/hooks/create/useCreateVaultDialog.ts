import { DialogRootProps } from '@chakra-ui/react';
import { useCallback } from 'react';

import { queryClient } from '@/config';
import { useQueryParams } from '@/modules/auth';
import { Pages } from '@/modules/core';
import { useCreateConnections } from '@/modules/dapp/hooks/useCreateConnection';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { TabState, useCreateVault } from './useCreateVault';

export interface UseCreateVaultDialogProps {
  onOpenChange?: DialogRootProps['onOpenChange'];
  onCreate?: () => void;
}

export type UseCreateVaultDialogReturn = ReturnType<
  typeof useCreateVaultDialog
>;

const useCreateVaultDialog = (props: UseCreateVaultDialogProps) => {
  const {
    form,
    tabs,
    vaultNameIsAvailable,
    vaultId,
    validateAddress,
    addresses,
    bakoSafeVault,
    ...rest
  } = useCreateVault();

  const { name, origin, sessionId, request_id } = useQueryParams();
  const isSignInFromDapp = sessionId && sessionId.length === 36;

  const disableCreateVaultButton =
    !form.formState.isValid ||
    !!form.formState.errors.addresses ||
    bakoSafeVault.isPending ||
    validateAddress.isLoading;

  const isCreateVaultButtonDisabled =
    disableCreateVaultButton && addresses.fields.length > 1;

  const createConnectionsMutation = useCreateConnections();
  const {
    authDetails: { userInfos },
    workspaceInfos: {
      handlers: { handleWorkspaceSelection },
    },
  } = useWorkspaceContext();

  const handleClose = () => {
    queryClient.invalidateQueries({ queryKey: ['vault/pagination'] });

    handleCancel();
  };

  const handleCancel = useCallback(() => {
    tabs.set(TabState.INFO);
    rest.setSearch('');
    form.resetField('addresses');
    form.resetField('description');
    form.resetField('name');
    form.resetField('minSigners');

    props.onOpenChange?.({ open: false });
  }, [form, props, tabs, rest]);

  const close = (close_call: () => void, step?: TabState) => () => {
    const isValid = sessionId && name && origin && request_id;

    if (step && step == TabState.SUCCESS && isValid) {
      createConnectionsMutation.mutate({
        sessionId: sessionId!,
        name: name!,
        origin: origin!,
        request_id: request_id!,
        userAddress: userInfos?.address,
        vaultId: vaultId,
      });
    }
    tabs.set(TabState.INFO);
    return close_call();
  };

  const stepActions = {
    [TabState.INFO]: {
      hide: false,
      disable: !form.formState.isValid,
      onContinue: () => tabs.set(TabState.ADDRESSES),
      description:
        'Define the name and description of this vault. These details will be visible to all members.',
      onCancel: close(handleCancel),
      closeText: 'Cancel',
      nextStepText: 'Continue',
    },
    [TabState.ADDRESSES]: {
      hide: false,
      disable: isCreateVaultButtonDisabled,
      onContinue: form.handleCreateVault,
      description:
        'Define the details of your vault. Set up this rules carefully because it cannot be changed later.',
      onCancel: close(() => {
        tabs.set(TabState.INFO);
        close(handleCancel)();
      }),
      closeText: 'Cancel',
      nextStepText: 'Create Vault',
    },
    [TabState.SUCCESS]: {
      hide: true,
      disable: false,
      description: null,
      onContinue: () => {
        if (!isSignInFromDapp) {
          handleWorkspaceSelection(
            userInfos?.workspace?.id,
            Pages.detailsVault({
              vaultId,
              workspaceId: userInfos?.workspace?.id,
            }),
          ).then(props.onCreate);
        }
        handleClose();
      },
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
    validateAddress,
    addresses,
    bakoSafeVault,
    ...rest,
  };
};

export { useCreateVaultDialog };
