import { Button } from '@chakra-ui/react';

import { Dialog } from '@/components';
import { PredicateUpdatePayload } from '@/modules/core';
import { useUpdateVault } from '@/modules/vault/hooks';

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
  const { isPending, updateVault } = useUpdateVault(workspaceId);

  const handleVaultUpdate = (data: PredicateUpdatePayload) => {
    updateVault(
      { id: initialValues.id, ...data },
      {
        onSuccess: () => {
          onClose();
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
        <Button
          variant="secondary"
          disabled={isPending}
          onClick={onClose}
          px={6}
        >
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
