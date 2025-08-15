import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';

import { FuelIcon, RigIcon } from '@/components';

interface MobileItemLiquidStakeProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export function MobileDropdownLiquidStake({
  isOpen,
  onClose,
  children,
}: MobileItemLiquidStakeProps) {
  return (
    <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent padding={4} bg={'dark.950'}>
        <DrawerHeader>
          <HStack marginBottom={4} fontWeight="normal">
            <Icon as={FuelIcon} fontSize={24} />
            <Text fontSize={12}>Liquid Stake FUEL</Text>
            <HStack
              flex={1}
              justifyContent="flex-end"
              alignItems="center"
              display={{ base: 'flex', md: 'none' }}
            >
              <Text fontSize={10}>powered by</Text>
              <RigIcon fontSize={32} />
            </HStack>
          </HStack>
        </DrawerHeader>
        <DrawerBody>
          <VStack alignItems="flex-start">{children}</VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
