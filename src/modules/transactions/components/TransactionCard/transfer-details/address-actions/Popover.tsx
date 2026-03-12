import { Popover, Separator } from 'bako-ui';
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
      positioning={{ placement: 'right-start' }}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <Popover.Trigger asChild>
        <AddressActionsButton onClick={onToggle} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Content bg="gray.550" p={0} borderRadius="lg">
            <Popover.Body p={0}>
              {!hasContact && (
                <>
                  <AddToAddressBook address={address} onClick={onClose} />
                  <Separator borderColor="bg.muted" />
                </>
              )}
              <CopyAddress
                address={Address.fromString(address).toString()}
                onClose={hasContact && !handle ? onClose : undefined}
              />
              {handle && (
                <>
                  <Separator borderColor="bg.muted" />
                  <GoToBakoId handle={handle} />
                </>
              )}
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};

export { AddressActionsPopover };
