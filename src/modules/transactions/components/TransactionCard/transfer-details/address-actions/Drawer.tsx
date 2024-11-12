import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
} from '@chakra-ui/react';

import { AddressActionsButton } from './Button';
import { CopyAddress, GoToBakoId } from './options';

interface AddressActionsDrawerProps {
  address: string;
  handle?: string;
}

const AddressActionsDrawer = ({
  address,
  handle,
}: AddressActionsDrawerProps) => {
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
        <DrawerOverlay
          backdropFilter={'blur(4px)'}
          bgColor="grey.25"
          zIndex={1400}
        />
        <DrawerContent bg={'dark.950'} p={0} borderTopRadius={8}>
          <CopyAddress address={address} onClose={onClose} />
          {handle && <GoToBakoId handle={handle} onClose={onClose} />}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export { AddressActionsDrawer };
