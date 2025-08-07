import { HStack, Icon, Text, useDisclosure, VStack } from '@chakra-ui/react';

import { PlusIcon } from '@/components';
import { CreateContactDialog } from '@/modules/addressBook/components/dialog';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface AddToAddressBookProps {
  address: string;
}

const AddToAddressBook = ({ address }: AddToAddressBookProps) => {
  const contactDialog = useDisclosure();

  const {
    addressBookInfos: {
      handlers: { handleOpenDialog },
      requests: { createContactRequest },
      form: contactForm,
    },
  } = useWorkspaceContext();

  const dialog = {
    ...contactDialog,
    onClose: () => {
      contactDialog.onClose();
      contactForm.setValue('address', '');
      contactForm.setValue('nickname', '');
    },
  };

  return (
    <>
      <CreateContactDialog
        form={contactForm}
        dialog={dialog}
        isLoading={createContactRequest.isPending}
        isEdit={false}
      />

      <HStack
        spacing={4}
        px={4}
        py={3}
        cursor="pointer"
        onClick={() => {
          handleOpenDialog?.({
            address,
          });
        }}
      >
        <Icon as={PlusIcon} color="grey.50" fontSize="xs" />
        <VStack alignItems="flex-start" spacing={0} fontSize="xs">
          <Text color="grey.50">Add to Address Book</Text>
          <Text color="grey.425">Save this address to your address book</Text>
        </VStack>
      </HStack>
    </>
  );
};

export { AddToAddressBook };
