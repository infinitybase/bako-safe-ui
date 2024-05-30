import { Dialog, SquarePlusIcon } from '@/components';

import { CreateContactForm } from '../../components';
import { UseAddressBookReturn } from '../../hooks';

interface CreateContactDialogProps {
  form: UseAddressBookReturn['form'];
  dialog: UseAddressBookReturn['contactDialog'];
  isLoading: boolean;
  isEdit: boolean;
}

const CreateContactDialog = ({
  form,
  dialog,
  isLoading,
  isEdit,
}: CreateContactDialogProps) => {
  return (
    <Dialog.Modal
      size={{ base: 'full', sm: 'lg' }}
      isOpen={dialog.isOpen}
      closeOnOverlayClick={false}
      onClose={dialog.onClose}
    >
      <Dialog.Header
        position="relative"
        onClose={dialog.onClose}
        maxW={420}
        title={isEdit ? 'Edit address' : 'Add to address book'}
        description={
          isEdit
            ? 'Edit the name and address of this contact. These will be visible only to you.'
            : 'Define the name and address of this contact. These will be visible only to you.'
        }
      />

      <Dialog.Body maxW={420} mt={{ base: -4, sm: -8 }}>
        <CreateContactForm form={form} />
      </Dialog.Body>

      <Dialog.Actions mt="auto" maxW={420}>
        <Dialog.SecondaryAction onClick={dialog.onClose}>
          Cancel
        </Dialog.SecondaryAction>

        <Dialog.PrimaryAction
          type="submit"
          leftIcon={<SquarePlusIcon />}
          onClick={isEdit ? form.handleUpdateContact : form.handleCreateContact}
          isDisabled={isLoading}
          isLoading={isLoading}
        >
          {isEdit ? 'Edit' : 'Add it'}
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateContactDialog };
