import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react';

import { AddressActionsProps } from '.';
import { AddressActionsButton } from './Button';
import { CopyAddress, GoToBakoId } from './options';

const AddressActionsPopover = ({ address, handle }: AddressActionsProps) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="bottom-end">
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
          <CopyAddress address={address} onClose={onClose} />
          {handle && <GoToBakoId handle={handle} onClose={onClose} />}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export { AddressActionsPopover };
