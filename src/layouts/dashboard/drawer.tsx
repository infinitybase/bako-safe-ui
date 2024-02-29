import {
  Drawer as ChakraDrawer,
  DrawerContent,
  DrawerOverlay,
  DrawerProps as ChakraDrawerProps,
  HStack,
  Text,
} from '@chakra-ui/react';

import { CloseIcon } from '@/components/icons/close-icon';

import { Sidebar } from './sidebar';

interface DrawerProps extends Omit<ChakraDrawerProps, 'children'> {}

const Drawer = ({ ...props }: DrawerProps) => {
  const { onClose } = props;

  return (
    <ChakraDrawer {...props} size="xs" variant="solid" placement="left">
      <DrawerOverlay mt="64px" />
      <DrawerContent p={0} mt="64px" bgColor="dark.600">
        <HStack
          cursor="pointer"
          onClick={onClose}
          spacing={2}
          p={6}
          pt={5}
          pb={1}
        >
          <Text color="grey.100">Close</Text>
          <CloseIcon />
        </HStack>

        <Sidebar onDrawer />
      </DrawerContent>
    </ChakraDrawer>
  );
};

export { Drawer };
