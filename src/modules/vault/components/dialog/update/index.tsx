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
      size={{ sm: '2xl', base: 'full' }}
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
      <Dialog.Actions position="relative">
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
