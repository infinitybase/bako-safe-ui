import { Dialog, DialogModalProps, SquarePlusIcon } from '@/components';
import { useContact } from '@/modules/addressBook/hooks';

import { CreateContactForm } from '../../pages/create/form';

const CreateContactDialog = (props: Omit<DialogModalProps, 'children'>) => {
  const { form, address } = useContact();

  // TODO: Replace this hard coded var
  const name = '';

  const isEdit = !!address && !!name;

  return (
    <Dialog.Modal {...props}>
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
        <CreateContactForm form={form} address={address} />
      </Dialog.Body>

      <Dialog.Actions maxW={420}>
        <Dialog.SecondaryAction onClick={props.onClose}>
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
