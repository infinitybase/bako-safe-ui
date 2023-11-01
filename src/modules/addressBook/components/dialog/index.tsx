import { Dialog, DialogModalProps, SquarePlusIcon } from '@/components';
import { useCreateVaultDialog } from '@/modules/vault/hooks';

import { useCreateContact } from '../../create';
import { CreateContactForm } from '../../pages/create/form';

const CreateContactDialog = (props: Omit<DialogModalProps, 'children'>) => {
  const { handleCancel } = useCreateVaultDialog({
    onClose: props.onClose,
  });

  const { form } = useCreateContact();

  return (
    <Dialog.Modal {...props} onClose={handleCancel}>
      <Dialog.Header
        maxW={420}
        title="Add to address book"
        description="Define the name and address of this contact. These will be visible only to you."
      />

      <Dialog.Body maxW={420}>
        <CreateContactForm form={form} />
      </Dialog.Body>

      <Dialog.Actions maxW={420}>
        <Dialog.SecondaryAction onClick={handleCancel}>
          cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          // hidden={steps[step].hiddeFooter}
          type="submit"
          leftIcon={<SquarePlusIcon />}
          // isDisabled={steps[step].isLoading}
          // isLoading={steps[step].isLoading}
        >
          Add it
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateContactDialog };
