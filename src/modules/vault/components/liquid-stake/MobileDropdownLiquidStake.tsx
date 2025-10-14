import { Drawer, HStack, Icon, Text, VStack } from 'bako-ui';

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
    <Drawer.Root
      placement="bottom"
      onOpenChange={(e) => {
        e.open ? null : onClose();
      }}
      open={isOpen}
    >
      <Drawer.Backdrop />
      <Drawer.Content padding={4} bg={'dark.950'}>
        <Drawer.Header>
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
        </Drawer.Header>
        <Drawer.Body>
          <VStack alignItems="flex-start">{children}</VStack>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
}
