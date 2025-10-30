import {
  Drawer as ChakraDrawer,
  DrawerRootProps,
  IconButton,
  Portal,
} from 'bako-ui';

import { LineCloseIcon } from '@/components';

import { Sidebar } from '../../modules/vault/layout/sidebar';

interface DrawerProps extends Omit<DrawerRootProps, 'children'> {}

const Drawer = ({ onOpenChange, ...props }: DrawerProps) => {
  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange({ open: false });
    }
  };

  return (
    <ChakraDrawer.Root
      {...props}
      size="xs"
      placement="start"
      onOpenChange={onOpenChange}
      trapFocus={false}
    >
      <Portal>
        <ChakraDrawer.Backdrop />
        <ChakraDrawer.Positioner>
          <ChakraDrawer.Content p={0} maxW={{ smDown: '50%' }}>
            <ChakraDrawer.CloseTrigger asChild>
              <IconButton
                variant="ghost"
                onClick={handleClose}
                aria-label="Close"
                cursor="pointer"
                zIndex={1600}
              >
                <LineCloseIcon w="24px" />
              </IconButton>
            </ChakraDrawer.CloseTrigger>

            <Sidebar onClose={handleClose} onDrawer />
          </ChakraDrawer.Content>
        </ChakraDrawer.Positioner>
      </Portal>
    </ChakraDrawer.Root>
  );
};

export { Drawer };
