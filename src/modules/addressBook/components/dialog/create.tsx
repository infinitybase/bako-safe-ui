import { FormProvider } from 'react-hook-form';

import { Dialog } from '@/components';

import { CreateContactForm } from '../../components';
import { UseAddressBookReturn } from '../../hooks';

interface CreateContactDialogProps {
  form: UseAddressBookReturn['form'];
  dialog: UseAddressBookReturn['dialog']['contactDialog'];
  isLoading: boolean;
  isEdit?: boolean;
  address?: string;
}

const CreateContactDialog = ({
  form,
  dialog,
  isLoading,
  isEdit,
  address,
}: CreateContactDialogProps) => {
  return (
    <Dialog.Modal
      size={{ base: 'full', sm: 'md' }}
      open={dialog.isOpen}
      closeOnInteractOutside={false}
      trapFocus={false}
      onOpenChange={dialog.onOpenChange}
      modalContentProps={{ px: 6, py: 6 }}
      modalBodyProps={{ gap: 6 }}
    >
      <Dialog.Header
        position="relative"
        onClose={dialog.onClose}
        title={isEdit ? 'Edit address' : 'Add to address book'}
        titleSxProps={{
          color: 'textPrimary',
          fontSize: 'sm',
          lineHeight: 'shorter',
        }}
        description={
          isEdit
            ? 'Edit the name and address of this contact. These will be visible only to you.'
            : 'Define the name and address of this contact. Visible only to you.'
        }
        descriptionColor="textSecondary"
        descriptionFontSize="12px"
        mt={0}
        mb={0}
      />

      <Dialog.Body>
        <FormProvider {...form}>
          <CreateContactForm address={address} />
        </FormProvider>
      </Dialog.Body>

      <Dialog.Actions mt={6} w="full">
        <Dialog.SecondaryAction
          aria-label="Cancel address book"
          onClick={dialog.onClose}
        >
          Cancel
        </Dialog.SecondaryAction>

        <Dialog.PrimaryAction
          type="submit"
          w="auto"
          flex={1}
          onClick={isEdit ? form.handleUpdateContact : form.handleCreateContact}
          disabled={isLoading || !form.formState.isValid}
          loading={isLoading}
          aria-label={isEdit ? 'Edit address book' : 'Create address book'}
        >
          {isEdit ? 'Save changes' : 'Add'}
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateContactDialog };
