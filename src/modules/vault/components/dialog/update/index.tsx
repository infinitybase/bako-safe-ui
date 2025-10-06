import { Button } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';

import { Dialog } from '@/components';
import { useContactToast } from '@/modules/addressBook';
import { HomeQueryKey, PredicateUpdatePayload } from '@/modules/core';
import { useUpdateVault } from '@/modules/vault/hooks';
import { VAULT_TRANSACTIONS_LIST_PAGINATION } from '@/modules/vault/hooks/list/useVaultTransactionsRequest';

import { UpdateVaultForm } from './form';

interface UpdateVaultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: PredicateUpdatePayload & { id: string };
  workspaceId: string;
}

export const UpdateVaultDialog = ({
  initialValues,
  isOpen,
  onClose,
  workspaceId,
}: UpdateVaultDialogProps) => {
  const { isPending, updateVault } = useUpdateVault();
  const queryClient = useQueryClient();
  const { successToast, errorToast } = useContactToast();

  const handleVaultUpdate = (data: PredicateUpdatePayload) => {
    updateVault(
      { id: initialValues.id, ...data },
      {
        onSuccess: () => {
          onClose();
          queryClient.invalidateQueries({
            queryKey: ['vault/by-id', initialValues.id],
          });
          queryClient.invalidateQueries({
            queryKey: HomeQueryKey.HOME_DATA(workspaceId),
          });
          queryClient.invalidateQueries({
            queryKey: [VAULT_TRANSACTIONS_LIST_PAGINATION],
            exact: false,
          });
          successToast({ title: 'Vault updated successfully' });
        },
        onError: () => {
          errorToast({ title: 'Failed to update vault' });
        },
      },
    );
  };

  return (
    <Dialog.Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      modalBodyProps={{ px: 4 }}
    >
      <Dialog.Header title="Update Vault" onClose={onClose} />
      <Dialog.Body>
        <UpdateVaultForm
          initialValues={initialValues}
          onSubmit={handleVaultUpdate}
          vaultId={initialValues.id}
        />
      </Dialog.Body>
      <Dialog.Actions>
        <Button variant="secondary" disabled={isPending} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          isLoading={isPending}
          form="update-vault-form"
          w="full"
          type="submit"
        >
          Save
        </Button>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};
