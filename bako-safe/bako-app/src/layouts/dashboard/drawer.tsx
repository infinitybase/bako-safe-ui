import {
  Drawer as ChakraDrawer,
  DrawerContent,
  DrawerOverlay,
  DrawerProps as ChakraDrawerProps,
} from '@chakra-ui/react';
import { LineCloseIcon } from '@ui/icons';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { Sidebar } from '../../modules/vault/layout/sidebar';

interface DrawerProps extends Omit<ChakraDrawerProps, 'children'> {}

const Drawer = ({ ...props }: DrawerProps) => {
  const {
    screenSizes: { isSmall },
  } = useWorkspaceContext();
  const { onClose } = props;

  return (
    <ChakraDrawer
      {...props}
      size={isSmall ? 'full' : 'xs'}
      variant="solid"
      placement="left"
    >
      <DrawerOverlay mt={{ base: '64px', sm: '82px' }} />
      <DrawerContent
        p={0}
        mt={{ base: '64px', sm: '82px' }}
        bgColor="dark.950"
        boxShadow="8px 0px 6px 0px rgba(0, 0, 0, 0.15)"
      >
        <LineCloseIcon
          mt={3}
          mr={4}
          fontSize="24px"
          aria-label="Close window"
          cursor="pointer"
          onClick={onClose}
          alignSelf="end"
        />

        <Sidebar onDrawer />
      </DrawerContent>
    </ChakraDrawer>
  );
};

export { Drawer };
