import {
  Divider,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react';

import { AddressActionsProps } from '.';
import { AddressActionsButton } from './Button';
import { AddToAddressBook, CopyAddress, GoToBakoId } from './options';
import { Address } from 'fuels';

const AddressActionsPopover = (props: AddressActionsProps) => {
  const { address, handle, hasContact } = props;

  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="top-start">
      <PopoverTrigger>
        <AddressActionsButton
          onClick={onToggle}
          bgColor={isOpen ? 'dark.950' : 'grey.825'}
        />
      </PopoverTrigger>

      <PopoverContent
        bg="dark.950"
        p={0}
        borderRadius={8}
        borderColor="dark.100"
        _focus={{ ring: 'none' }}
      >
        <PopoverBody p={0}>
          {!hasContact && (
            <>
              <AddToAddressBook address={address} />
              <Divider borderColor="grey.825" />
            </>
          )}
          <CopyAddress
            address={Address.fromString(address).toString()}
            onClose={hasContact && !handle ? onClose : undefined}
          />
          {handle && (
            <>
              <Divider borderColor="grey.825" />
              <GoToBakoId handle={handle} />
            </>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export { AddressActionsPopover };
