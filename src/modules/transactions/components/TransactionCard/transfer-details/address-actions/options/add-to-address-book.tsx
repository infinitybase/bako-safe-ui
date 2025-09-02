import { HStack, Icon, Text, VStack } from '@chakra-ui/react';

import { PlusIcon } from '@/components';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface AddToAddressBookProps {
  address: string;
}

const AddToAddressBook = ({ address }: AddToAddressBookProps) => {
  const {
    addressBookInfos: {
      handlers: { handleOpenDialog },
    },
  } = useWorkspaceContext();

  return (
    <>
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
