import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { PlusIcon, RemoveIcon } from '@/components';
import { NetworkType, useCurrentNetwork } from '@/modules';

interface NetworkDrawerProps extends Omit<DrawerProps, 'children'> {}

enum NetworkDrawerMode {
  SELECT = 'select',
  ADD = 'add',
  CONFIRM = 'confirm',
}

const NetworkDrawer = ({ ...props }: NetworkDrawerProps) => {
  const [mode, setMode] = useState<NetworkDrawerMode>(NetworkDrawerMode.SELECT);
  const [validNetwork, setValidNetwork] = useState(false);

  const {
    availableNetWorks,
    addedNetWorks,
    handleUpdateNetwork,
    currentNetwork,
  } = useCurrentNetwork();

  const form = useForm();

  const handleAddNetwork = () => {
    // TODO: Implement this
    alert('handleAddNetwork');
  };

  const handleTestNetwork = () => {
    // TODO: Implement this
    alert('handleTestNetwork');
  };

  const handleClose = () => {
    setMode(NetworkDrawerMode.SELECT);
    props.onClose();
  };

  return (
    <Drawer
      {...props}
      onClose={handleClose}
      size="sm"
      variant="solid-dark"
      placement="bottom"
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
          {mode === NetworkDrawerMode.SELECT && (
            <VStack spacing={4}>
              <VStack spacing={2} w="full">
                {[...availableNetWorks, ...addedNetWorks].map((net) => {
                  const isSelected = net.url === currentNetwork.url;

                  return (
                    <Center
                      w="full"
                      h={70}
                      key={net.url}
                      bg={
                        isSelected
                          ? 'linear-gradient(45deg, #FFC010,#EBA312,#D38015, #B24F18)'
                          : 'grey.950'
                      }
                      borderRadius={8}
                    >
                      <HStack
                        cursor="pointer"
                        onClick={() => {
                          props.onClose();
                          handleUpdateNetwork(net.url);
                        }}
                        w="calc(100% - 2px)"
                        h="calc(70px - 2px)"
                        px={4}
                        bg={isSelected ? 'grey.825' : 'dark.950'}
                        borderRadius={8}
                        spacing={4}
                      >
                        <Icon as={net.icon} fontSize={24} />

                        <Text fontSize={14} fontWeight={500} color="grey.75">
                          {net?.name}
                        </Text>

                        <Box flex={1} />

                        {net.identifier === NetworkType.LOCALSTORAGE && (
                          <Icon
                            as={RemoveIcon}
                            fontSize={16}
                            color={'grey.75'}
                            onClick={(e) => {
                              e.stopPropagation();
                              alert('deletar');
                              // TODO: Create handler to remove custom network
                            }}
                            transition={'all 0.1s'}
                            _hover={{ color: 'grey.250' }}
                          />
                        )}
                      </HStack>
                    </Center>
                  );
                })}

                <HStack
                  cursor="pointer"
                  onClick={() => setMode(NetworkDrawerMode.ADD)}
                  w="calc(100% - 2px)"
                  h="calc(70px - 2px)"
                  pl={4}
                  bg={'dark.950'}
                  border={'1px solid'}
                  borderColor={'grey.950'}
                  borderRadius={8}
                  spacing={4}
                >
                  <Icon as={PlusIcon} fontSize={22} />

                  <Text fontSize={14} fontWeight={500} color="grey.75">
                    Add new network
                  </Text>
                </HStack>
              </VStack>

              <Button
                w="full"
                h={'40px'}
                variant="outline"
                color={'grey.75'}
                borderColor={'grey.75'}
                onClick={handleClose}
                _hover={{ borderColor: 'brand.500', color: 'brand.500' }}
                sx={{ _active: { bg: 'inherit' } }}
              >
                Cancel
              </Button>
            </VStack>
          )}

          {mode === NetworkDrawerMode.ADD && (
            <VStack spacing={10}>
              <VStack spacing={2} w="full">
                <Controller
                  control={form.control}
                  name="networkUrl"
                  render={({ field, fieldState }) => (
                    <FormControl isInvalid={fieldState.invalid}>
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        placeholder=" "
                        variant="dark"
                        maxLength={27}
                        bg={'grey.825'}
                        border={'1px solid'}
                        borderColor={'grey.125'}
                      />
                      <FormLabel>Network URL</FormLabel>
                      <FormHelperText color="error.500">
                        {fieldState.error?.message}
                      </FormHelperText>
                    </FormControl>
                  )}
                />

                <Button
                  w="full"
                  h={'40px'}
                  variant="outline"
                  color={'grey.75'}
                  borderColor={'grey.75'}
                  onClick={handleTestNetwork}
                  _hover={{ borderColor: 'inherit', color: 'inherit' }}
                  sx={{ _active: { bg: 'inherit' } }}
                >
                  Test connection
                </Button>
              </VStack>

              <Button
                w="100%"
                variant="primary"
                fontWeight="bold"
                onClick={handleAddNetwork}
                isDisabled={!validNetwork}
              >
                Add network
              </Button>
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export { NetworkDrawer };
