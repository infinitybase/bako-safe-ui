import { Drawer, Separator } from 'bako-ui';

import { useDisclosure } from '@/modules/core/hooks/useDisclosure';

import { AddressActionsProps } from './AddressActions';
import { AddressActionsButton } from './Button';
import { AddToAddressBook, CopyAddress, GoToBakoId } from './options';

const AddressActionsDrawer = (props: AddressActionsProps) => {
  const { address, handle, hasContact } = props;

  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <AddressActionsButton onClick={onOpen} />

      <Drawer.Root
        open={isOpen}
        onOpenChange={onOpenChange}
        size="sm"
        // variant="solid-dark"
        placement="bottom"
      >
        <Drawer.Backdrop zIndex={1400} />
        <Drawer.Content bg={'dark.950'} p={0} borderTopRadius={8}>
          {!hasContact && (
            <>
              <AddToAddressBook address={address} />
              <Separator borderColor="grey.825" />
            </>
          )}
          <CopyAddress
            address={address}
            onClose={hasContact && !handle ? onClose : undefined}
          />
          {handle && (
            <>
              <Separator borderColor="grey.825" />
              <GoToBakoId handle={handle} />
            </>
          )}
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
};

export { AddressActionsDrawer };
