import { Drawer as ChakraDrawer, Portal } from 'bako-ui';

import { LineCloseIcon } from '@/components';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { Sidebar } from '../../modules/vault/layout/sidebar';

interface DrawerProps extends Omit<ChakraDrawer.RootProps, 'children'> {}

const Drawer = ({ onOpenChange, ...props }: DrawerProps) => {
  const {
    screenSizes: { isSmall },
  } = useWorkspaceContext();

  return (
    <ChakraDrawer.Root
      {...props}
      size={isSmall ? 'xl' : 'xs'}
      // variant="solid"
      placement="start"
      onOpenChange={onOpenChange}
    >
      <Portal>
        <ChakraDrawer.Backdrop mt={{ base: '64px', sm: '72px' }} />
        <ChakraDrawer.Positioner>
          <ChakraDrawer.Content
            p={0}
            mt={{ base: '64px', sm: '72px' }}
            bgColor="dark.950"
            boxShadow="8px 0px 6px 0px rgba(0, 0, 0, 0.15)"
          >
            <ChakraDrawer.CloseTrigger asChild>
              <LineCloseIcon
                w="24px"
                aria-label="Close window"
                cursor="pointer"
              />
            </ChakraDrawer.CloseTrigger>

            <Sidebar onClose={() => onOpenChange?.({ open: false })} onDrawer />
          </ChakraDrawer.Content>
        </ChakraDrawer.Positioner>
      </Portal>
    </ChakraDrawer.Root>
  );
};

export { Drawer };
