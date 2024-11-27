import {
  Divider,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
} from '@chakra-ui/react';

import { AddressActionsProps } from './AddressActions';
import { AddressActionsButton } from './Button';
import { AddToAddressBook, CopyAddress, GoToBakoId } from './options';

const AddressActionsDrawer = (props: AddressActionsProps) => {
  const { address, handle, hasContact } = props;

  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <AddressActionsButton onClick={onOpen} />

      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
        variant="solid-dark"
        placement="bottom"
      >
        <DrawerOverlay zIndex={1400} />
        <DrawerContent bg={'dark.950'} p={0} borderTopRadius={8}>
          {!hasContact && (
            <>
              <AddToAddressBook address={address} />
              <Divider borderColor="grey.825" />
            </>
          )}
          <CopyAddress
            address={address}
            onClose={hasContact && !handle ? onClose : undefined}
          />
          {handle && (
            <>
              <Divider borderColor="grey.825" />
              <GoToBakoId handle={handle} />
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export { AddressActionsDrawer };
