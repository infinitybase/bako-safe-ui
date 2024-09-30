import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';

import { useCurrentNetwork } from '@/modules';

interface NetworkDrawerProps extends Omit<DrawerProps, 'children'> {}

const NetworkDrawer = ({ ...props }: NetworkDrawerProps) => {
  const { availableNetWorks, selectedNetwork, setSelectedNetwork } =
    useCurrentNetwork();

  return (
    <Drawer {...props} size="sm" variant="solid-dark" placement="bottom">
      <DrawerOverlay />
      <DrawerContent p={4}>
        <DrawerHeader mb={4}>
          <VStack alignItems="flex-start" spacing={4}>
            <HStack
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              w="full"
            >
              <Heading fontSize={16} fontWeight={700} color="grey.50">
                Select Network
              </Heading>
            </HStack>
          </VStack>
        </DrawerHeader>

        <DrawerBody>
          <VStack spacing={4}>
            <VStack spacing={2} w="full">
              {availableNetWorks.map((network) => {
                const isSelected = network.name === selectedNetwork?.name;

                return (
                  <HStack
                    key={network.name}
                    cursor="pointer"
                    onClick={() => setSelectedNetwork(network)}
                    w="full"
                    h={70}
                    pl={4}
                    borderWidth={1}
                    borderColor={isSelected ? 'warning.500' : 'grey.950'}
                    borderRadius={8}
                    spacing={4}
                    bg={isSelected ? 'grey.825' : 'dark.950'}
                    // borderImage={'linear-gradient(45deg, red, blue) 1'}
                    // style={{
                    //   borderImage: 'linear-gradient(45deg, #F59E1C, #FFC010) 1',
                    // }}
                  >
                    <Icon as={network.icon} fontSize={24} />

                    <Text fontSize={14} fontWeight={500} color="grey.75">
                      {network.name}
                    </Text>
                  </HStack>
                );
              })}
            </VStack>

            <Button
              w="full"
              h={'40px'}
              variant="outline"
              color={'grey.75'}
              borderColor={'grey.75'}
              onClick={props.onClose}
              _hover={{ borderColor: 'brand.500', color: 'brand.500' }}
            >
              Cancel
            </Button>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export { NetworkDrawer };
