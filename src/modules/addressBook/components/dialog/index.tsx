import { Dialog, SquarePlusIcon } from '@/components';

import { UseCreateContactReturn } from '../../hooks';
import { CreateContactForm } from '../../pages/create/form';

interface CreateContactDialogProps {
  form: UseCreateContactReturn['form'];
  dialog: UseCreateContactReturn['contactDialog'];
}

const CreateContactDialog = ({ form, dialog }: CreateContactDialogProps) => {
  // TODO: Replace this hard coded var
  const name = '';

  const address = form.watch('address');
  const isEdit = !!address && !!name;

  return (
    <Dialog.Modal onClose={dialog.onClose} isOpen={dialog.isOpen}>
      <Dialog.Header
        maxW={420}
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
          cancel
        </Dialog.SecondaryAction>

        <Dialog.PrimaryAction
          type="submit"
          leftIcon={<SquarePlusIcon />}
          onClick={form.handleCreateContact}
          isDisabled={form.formState.isLoading}
          isLoading={form.formState.isLoading}
        >
          Add it
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateContactDialog };
