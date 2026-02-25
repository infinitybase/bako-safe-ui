import {
  Center,
  Drawer,
  DrawerProps,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from 'bako-ui';

import { UnknownIcon } from '@/components';
import { BakoIcon } from '@/components/icons/assets/bakoIcon';

import { NetworkDrawerMode, useNetworks } from '../../hooks';
import { availableNetWorks, NetworkType } from '../../services';

interface NetworkDrawerProps extends Omit<DrawerProps, 'children'> {}

const NetworkSignInDrawer = ({ ...props }: NetworkDrawerProps) => {
  const { networks, mode, handleSelection } = useNetworks(props.onClose);

  return (
    <Drawer.Root
      {...props}
      // onClose={handleClose}
      size="sm"
      variant="solid-dark"
      placement="bottom"
      closeOnOverlayClick={false}
    >
      <Drawer.Backdrop />
      <Drawer.Content bg={'dark.950'} p={4}>
        <Drawer.Header mb={4}>
          <VStack alignItems="flex-start" gap={4}>
            <HStack
              gap={2}
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
        </Drawer.Header>

        <Drawer.Body>
          {networks && mode === NetworkDrawerMode.SELECT && (
            <VStack gap={4}>
              <VStack gap={2} w="full">
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
                        gap={4}
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
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
};

export { NetworkSignInDrawer };
