import { Button, DialogOpenChangeDetails } from 'bako-ui';

import { Dialog } from '@/components';
import { PredicateUpdatePayload } from '@/modules/core';
import { useUpdateVault } from '@/modules/vault/hooks';

import { UpdateVaultForm } from './form';

interface UpdateVaultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange?: (details: DialogOpenChangeDetails) => void;
  initialValues: PredicateUpdatePayload & { id: string };
  workspaceId: string;
}

export const UpdateVaultDialog = ({
  initialValues,
  isOpen,
  onClose,
  workspaceId,
  onOpenChange,
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
      open={isOpen}
      onOpenChange={onOpenChange}
      size={{ sm: 'sm', base: 'full' }}
      modalBodyProps={{ px: 4 }}
    >
      <Dialog.Header
        title="Edit Vault"
        onClose={onClose}
        mt={{ base: 4, xs: 0 }}
      />
      <Dialog.Body flex={1}>
        <UpdateVaultForm
          initialValues={initialValues}
          onSubmit={handleVaultUpdate}
          vaultId={initialValues.id}
        />
      </Dialog.Body>
      <Dialog.Actions position="relative" hideDivider mt={4}>
        <Button variant="outline" disabled={isPending} onClick={onClose} px={6}>
          Cancel
        </Button>
        <Button
          loading={isPending}
          form="update-vault-form"
          flex={1}
          type="submit"
        >
          Save
        </Button>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};
