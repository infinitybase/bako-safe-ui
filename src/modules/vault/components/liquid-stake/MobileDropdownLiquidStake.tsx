import { Drawer, HStack, Icon, Image, Text, VStack } from 'bako-ui';

import { FuelIcon, RigIcon } from '@/components';
import poweredByRig from "@/assets/svg/powered-by-rig.svg";

interface MobileItemLiquidStakeProps {
  isOpen: boolean;
  onClose: () => void;
  isPendingSigner: boolean;
  children?: React.ReactNode;
}

export function MobileDropdownLiquidStake({
  isOpen,
  onClose,
  isPendingSigner,
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
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content padding={4} bg="bg.panel">
            <Drawer.Header>
              <VStack alignItems="flex-start" gap={0} maxW={["130px", "320px"]}>
                <Text
                  fontWeight={600}
                  fontSize={14}
                  color="textPrimary"
                >
                  Liquid Stake FUEL
                </Text>
                {isPendingSigner && (
                  <Text
                    fontSize="xs"
                    color="primary.main"
                  >
                    This account has pending transactions.
                  </Text>
                )}
              </VStack>
              <HStack
                flex={1}
                alignItems="flex-start"
                justifyContent="flex-end"
                display={'flex'}
              >
                <Image
                  src={poweredByRig}
                  alt="Powered by Rig"
                  w="auto"
                  maxH={8}
                />
              </HStack>
            </Drawer.Header>
            <Drawer.Body>
              <VStack alignItems="flex-start">{children}</VStack>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
