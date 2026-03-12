import { DialogOpenChangeDetails, Drawer } from 'bako-ui';
import React from 'react';

import { Dialog } from '../dialog';

export const WelcomeRoot = ({
  isMobile,
  open,
  onOpenChange,
  children,
}: {
  isMobile: boolean;
  open: boolean;
  onOpenChange: (value: DialogOpenChangeDetails) => void;
  children: React.ReactNode;
}) => {
  if (isMobile) {
    return (
      <Drawer.Root open={open} onOpenChange={onOpenChange} placement="bottom">
        <Drawer.Portal>
          <Drawer.Positioner>
            <Drawer.Content roundedTop="2xl">{children}</Drawer.Content>
          </Drawer.Positioner>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Dialog.Modal
      onOpenChange={onOpenChange}
      open={open}
      closeOnEscape={false}
      trapFocus={false}
      closeOnInteractOutside={false}
      size={{ base: 'full', sm: 'lg' }}
      modalContentProps={{
        px: 6,
        py: 6,
      }}
    >
      {children}
    </Dialog.Modal>
  );
};
