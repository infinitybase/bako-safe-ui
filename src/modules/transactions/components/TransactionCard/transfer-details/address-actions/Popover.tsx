import { Popover, Separator } from '@chakra-ui/react';
import { Address } from 'fuels';

import { useDisclosure } from '@/modules/core/hooks/useDisclosure';

import { AddressActionsProps } from '.';
import { AddressActionsButton } from './Button';
import { AddToAddressBook, CopyAddress, GoToBakoId } from './options';

const AddressActionsPopover = (props: AddressActionsProps) => {
  const { address, handle, hasContact } = props;

  const { isOpen, onToggle, onClose, setOpen } = useDisclosure();

  return (
    <Popover.Root
      open={isOpen}
      positioning={{ placement: 'top-start' }}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <Popover.Trigger>
        <AddressActionsButton
          onClick={onToggle}
          bgColor={isOpen ? 'dark.950' : 'grey.825'}
        />
      </Popover.Trigger>

      <Popover.Content
        bg="dark.950"
        p={0}
        borderRadius={8}
        borderColor="dark.100"
        _focus={{ ring: 'none' }}
      >
        <Popover.Body p={0}>
          {!hasContact && (
            <>
              <AddToAddressBook address={address} />
              <Separator borderColor="grey.825" />
            </>
          )}
          <CopyAddress
            address={Address.fromString(address).toString()}
            onClose={hasContact && !handle ? onClose : undefined}
          />
          {handle && (
            <>
              <Separator borderColor="grey.825" />
              <GoToBakoId handle={handle} />
            </>
          )}
        </Popover.Body>
      </Popover.Content>
    </Popover.Root>
  );
};

export { AddressActionsPopover };
