import {
  Drawer as ChakraDrawer,
  DrawerContent,
  DrawerOverlay,
  DrawerProps as ChakraDrawerProps,
} from '@chakra-ui/react';

import { LineCloseIcon } from '@/components';

import { Sidebar } from './sidebar';

interface DrawerProps extends Omit<ChakraDrawerProps, 'children'> {}

const Drawer = ({ ...props }: DrawerProps) => {
  const { onClose } = props;

  return (
    <ChakraDrawer {...props} size="xs" variant="solid" placement="left">
      <DrawerOverlay mt={{ base: '64px', sm: '82px' }} />
      <DrawerContent p={0} mt={{ base: '64px', sm: '82px' }} bgColor="dark.500">
        <LineCloseIcon
          mt={3}
          mb={1}
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
