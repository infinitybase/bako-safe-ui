import { availableNetWorks, NetworkType } from '@bako-safe/services';
import { BakoIcon, UnknownIcon } from '@bako-safe/ui';
import {
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  type DrawerProps,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';

import { NetworkDrawerMode, useNetworks } from '../../hooks';

interface NetworkDrawerProps extends Omit<DrawerProps, 'children'> {}

const NetworkSignInDrawer = ({ ...props }: NetworkDrawerProps) => {
  const { networks, mode, handleSelection } = useNetworks(props.onClose);

  return (
    <Drawer
      {...props}
      // onClose={handleClose}
      size="sm"
      variant="solid-dark"
      placement="bottom"
      closeOnOverlayClick={false}
    >
      <DrawerOverlay />
      <DrawerContent bg={'dark.950'} p={4}>
        <DrawerHeader mb={4}>
          <VStack alignItems="flex-start" spacing={4}>
            <HStack
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              w="full"
            >
              <Heading fontSize={16} fontWeight={700} color="grey.50">
                {mode === NetworkDrawerMode.SELECT
                  ? 'Select Network'
                  : 'Add new network'}
              </Heading>
            </HStack>
          </VStack>
        </DrawerHeader>

        <DrawerBody>
          {networks && mode === NetworkDrawerMode.SELECT && (
            <VStack spacing={4}>
              <VStack spacing={2} w="full">
                {networks.map((net) => {
                  return (
                    <Center
                      key={net.url}
                      w="full"
                      h={70}
                      bg={'grey.950'}
                      borderRadius={8}
                    >
                      <HStack
                        cursor="pointer"
                        onClick={() => handleSelection(net)}
                        w="calc(100% - 2px)"
                        h="calc(70px - 2px)"
                        px={4}
                        bg={'dark.950'}
                        borderRadius={8}
                        spacing={4}
                      >
                        <Icon
                          as={
                            net.chainId ===
                            availableNetWorks[NetworkType.MAINNET].chainId
                              ? BakoIcon
                              : UnknownIcon
                          }
                          fontSize={24}
                        />

                        <Text fontSize={14} fontWeight={500} color="grey.75">
                          {net?.name}
                        </Text>
                      </HStack>
                    </Center>
                  );
                })}
              </VStack>
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export { NetworkSignInDrawer };
