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
        placement="bottom"
      >
        <Drawer.Portal>
          <Drawer.Backdrop zIndex={1400} />
          <Drawer.Positioner>
            <Drawer.Content bg="gray.550" p={0} borderTopRadius={8}>
              {!hasContact && (
                <>
                  <AddToAddressBook address={address} />
                  <Separator borderColor="bg.muted" />
                </>
              )}
              <CopyAddress
                address={address}
                onClose={hasContact && !handle ? onClose : undefined}
              />
              {handle && (
                <>
                  <Separator borderColor="bg.muted" />
                  <GoToBakoId handle={handle} />
                </>
              )}
            </Drawer.Content>
          </Drawer.Positioner>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
};

export { AddressActionsDrawer };
