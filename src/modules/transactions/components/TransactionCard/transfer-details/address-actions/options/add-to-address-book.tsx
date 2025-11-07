import { HStack, Icon, Text } from 'bako-ui';

import { BookmarkIcon } from '@/components';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

interface AddToAddressBookProps {
  address: string;
  onClick?: () => void;
}

const AddToAddressBook = ({ address, onClick }: AddToAddressBookProps) => {
  const {
    addressBookInfos: {
      handlers: { handleOpenDialog },
    },
  } = useWorkspaceContext();

  return (
    <>
      <HStack
        gap={3}
        p={3}
        cursor="pointer"
        onClick={() => {
          onClick?.();
          handleOpenDialog?.({
            address,
          });
        }}
      >
        <Icon as={BookmarkIcon} color="gray.200" boxSize={3} />
        <Text color="gray.200" fontSize="xs">
          Save address
        </Text>
      </HStack>
    </>
  );
};

export { AddToAddressBook };
