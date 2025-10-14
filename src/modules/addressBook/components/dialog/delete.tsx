import { Box, Center, Flex, Heading, Icon, Text, VStack } from 'bako-ui';

import { AlertIcon, Dialog } from '@/components';

import { UseAddressBookReturn } from '../../hooks';

interface ContactToDelete {
  id: string;
  nickname: string;
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
      size={{ base: 'full', sm: 'lg' }}
      onClose={dialog.onClose}
      isOpen={dialog.isOpen}
      closeOnOverlayClick={false}
    >
      <Dialog.Header
        mb={0}
        mt={0}
        h={6}
        title=""
        description=""
        onClose={dialog.onClose}
        maxW={420}
      />
      <Dialog.Body
        mt={{ base: 'auto', sm: 6 }}
        mb="auto"
        maxW={420}
        justifyContent="center"
      >
        <VStack>
          <Flex alignItems="center" justifyContent="center" position="relative">
            <Box h="100px" w="100px" bg="error.900" borderRadius={10} />
            <Center position="absolute">
              <Icon
                position="relative"
                as={AlertIcon}
                color="error.600"
                fontSize={52}
              />
            </Center>
          </Flex>

          <Box mt={6} mb={2}>
            <Heading color="grey.200">Double check it!</Heading>
          </Box>

          <Text maxW={360} color="grey.200" textAlign="center" display="flex">
            {`Are you sure you wanna delete "${contactToDelete.nickname}" from your address book?`}
          </Text>
        </VStack>
      </Dialog.Body>

      <Dialog.Actions maxW={420}>
        <Dialog.SecondaryAction
          aria-label={'Delete adb'}
          w={32}
          isLoading={isLoading}
          onClick={() => handleDelete(contactToDelete.id)}
        >
          Yes, delete it!
        </Dialog.SecondaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { DeleteContactDialog };
