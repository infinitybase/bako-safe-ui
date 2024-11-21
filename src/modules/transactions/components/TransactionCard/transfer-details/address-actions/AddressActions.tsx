import { useScreenSize } from '@/modules/core/hooks';

import { AddressActionsDrawer } from './Drawer';
import { AddressActionsPopover } from './Popover';

export interface AddressActionsProps {
  address: string;
  handle?: string;
}

const AddressActions = ({ address, handle }: AddressActionsProps) => {
  const { isMobile } = useScreenSize();

  return isMobile ? (
    <AddressActionsDrawer address={address} handle={handle} />
  ) : (
    <AddressActionsPopover address={address} handle={handle} />
  );
};

export { AddressActions };
