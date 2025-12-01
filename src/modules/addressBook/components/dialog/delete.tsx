import { Heading, Icon, Span, Text, VStack } from 'bako-ui';

import { AlertIcon, Dialog } from '@/components';
import { AddressUtils } from '@/modules/core';

import { UseAddressBookReturn } from '../../hooks';

interface ContactToDelete {
  id: string;
  nickname: string;
  address: string;
}

interface DeleteContactDialogProps {
  contactToDelete: ContactToDelete;
  dialog: UseAddressBookReturn['dialog']['deleteContactDialog'];
  isLoading: boolean;
  handleDelete: (id: string) => void;
}

const DeleteContactDialog = ({
  contactToDelete,
  dialog,
  isLoading,
  handleDelete,
}: DeleteContactDialogProps) => {
  return (
    <Dialog.Modal
      size={{ base: 'full', sm: 'md' }}
      onOpenChange={dialog.onClose}
      open={dialog.isOpen}
      closeOnInteractOutside={false}
      modalContentProps={{ px: 6, py: 6 }}
      modalBodyProps={{ gap: 6 }}
    >
      <Dialog.Header
        mb={0}
        mt={0}
        h={6}
        title=""
        description=""
        onClose={dialog.onClose}
      />

      <Dialog.Body justifyContent="center">
        <VStack gap={6} w="full" alignItems="center">
          <Icon position="relative" as={AlertIcon} color="red" boxSize="48px" />

          <Heading
            color="red"
            lineHeight="shorter"
            fontSize="md"
            fontWeight="bold"
          >
            Double check it!
          </Heading>

          <Text
            color="gray.400"
            textAlign="center"
            fontSize="sm"
            fontWeight="semibold"
          >
            Delete{' '}
            <Span color="textPrimary">{`${contactToDelete.nickname} - ${AddressUtils.format(contactToDelete.address, 4)} `}</Span>
            from your address book?
          </Text>
        </VStack>
      </Dialog.Body>

      <Dialog.Actions display="flex" gap={3} w="full" px={3} mt={6}>
        <Dialog.SecondaryAction w="auto" flex={1} onClick={dialog.onClose}>
          Cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          w="auto"
          flex={1}
          colorPalette="red"
          loading={isLoading}
          color="primary.contrast"
          onClick={() => handleDelete(contactToDelete.id)}
        >
          Yes, delete it!
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { DeleteContactDialog };
