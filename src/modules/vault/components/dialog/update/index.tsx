import { Button, DialogOpenChangeDetails } from 'bako-ui';

import { Dialog } from '@/components';
import { PredicateUpdatePayload } from '@/modules/core';
import {
  useUpdateVaultForm,
  useUpdateVaultRequest,
} from '@/modules/vault/hooks';

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
  const { form, nameAlreadyExists } = useUpdateVaultForm({
    initialValues,
    vaultId: initialValues.id,
  });
  const { isPending, updateVault } = useUpdateVaultRequest(workspaceId);

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
        title="Edit Account"
        onClose={onClose}
        mt={{ base: 4, sm: 0 }}
        mb={3}
        titleSxProps={{
          fontSize: 'sm',
          fontWeight: 'semibold',
          color: 'textPrimary',
        }}
      />
      <Dialog.Body flex={1}>
        <UpdateVaultForm
          form={form}
          nameAlreadyExists={nameAlreadyExists}
          onSubmit={handleVaultUpdate}
        />
      </Dialog.Body>
      <Dialog.Actions position="relative" mt={6}>
        <Button variant="outline" disabled={isPending} onClick={onClose} px={6}>
          Cancel
        </Button>
        <Button
          loading={isPending}
          disabled={!form.formState.isValid || nameAlreadyExists}
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
