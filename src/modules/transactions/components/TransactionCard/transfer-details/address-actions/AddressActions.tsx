import { useScreenSize } from '@/modules/core/hooks';

import { AddressActionsDrawer } from './Drawer';
import { AddressActionsPopover } from './Popover';

export interface AddressActionsProps {
  address: string;
  handle?: string;
  hasContact?: boolean;
}

const AddressActions = (props: AddressActionsProps) => {
  const { address, handle, hasContact } = props;

  const { isMobile } = useScreenSize();

  return isMobile ? (
    <AddressActionsDrawer
      address={address}
      handle={handle}
      hasContact={hasContact}
    />
  ) : (
    <AddressActionsPopover
      address={address}
      handle={handle}
      hasContact={hasContact}
    />
  );
};

export { AddressActions };
