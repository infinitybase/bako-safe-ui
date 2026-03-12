import { Button, DialogOpenChangeDetails } from 'bako-ui';

import { Dialog } from '@/components';
import { useContactToast } from '@/modules/addressBook';
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
  const { errorToast } = useContactToast();

  const handleVaultUpdate = (data: PredicateUpdatePayload) => {
    updateVault(
      { id: initialValues.id, ...data },
      {
        onSuccess: () => {
          onClose();
        },
        onError: () => {
          errorToast({
            title: 'Error editing account!',
            description: 'An error occurred while editing the account',
          });
        },
      },
    );
  };

  return (
    <Dialog.Modal
      open={isOpen}
      onOpenChange={onOpenChange}
      size={{ base: 'full', sm: 'md' }}
      modalContentProps={{ p: 0 }}
      modalBodyProps={{ gap: 6, p: 6 }}
    >
      <Dialog.Header
        title="Edit Account"
        description="Edit the name and description of this account."
        onClose={onClose}
        titleSxProps={{
          fontSize: 'sm',
          color: 'textPrimary',
          lineHeight: 'shorter',
        }}
        descriptionColor="textSecondary"
        descriptionFontSize="12px"
        my={0}
      />
      <Dialog.Body flex={1}>
        <UpdateVaultForm
          form={form}
          nameAlreadyExists={nameAlreadyExists}
          onSubmit={handleVaultUpdate}
        />
      </Dialog.Body>
      <Dialog.Actions position="relative">
        <Button variant="subtle" disabled={isPending} onClick={onClose} px={6}>
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
