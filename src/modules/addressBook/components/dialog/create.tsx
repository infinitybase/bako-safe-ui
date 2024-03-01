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
      onClose={dialog.onClose}
      isOpen={dialog.isOpen}
      closeOnOverlayClick={false}
    >
      <Dialog.Header
        maxW={500}
        title={isEdit ? 'Edit address' : 'Add to address book'}
        description={
          isEdit
            ? 'Edit the name and address of this contact. These will be visible only to you.'
            : 'Define the name and address of this contact. These will be visible only to you.'
        }
      />

      <Dialog.Body maxW={420}>
        <CreateContactForm form={form} />
      </Dialog.Body>

      <Dialog.Actions maxW={420}>
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
