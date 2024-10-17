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
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { PlusIcon, RemoveIcon, UnknownIcon } from '@/components';
import { BakoIcon } from '@/components/icons/assets/bakoIcon';
import { TypeUser } from '@/modules/auth/services';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { NetworkDrawerMode, useNetworks } from '../../hooks';
import { availableNetWorks, NetworkType } from '../../services';

interface NetworkDrawerProps extends Omit<DrawerProps, 'children'> {}

const NetworkDrawer = ({ ...props }: NetworkDrawerProps) => {
  const {
    networks,
    handleSelectNetwork,
    currentNetwork,
    handleAddNetwork,
    networkForm,
    handleDeleteCustomNetwork,
    handleCheckNetwork,
    validNetwork,
    mode,
    setMode,
    selectNetworkRequest,
    checkNetworkRequest: { isPending: loadingCheck },
    handleClose,
    setValidNetwork,
  } = useNetworks(props.onClose);

  const { authDetails } = useWorkspaceContext();
  const isWebAuthn = authDetails.userInfos?.type?.type === TypeUser.WEB_AUTHN;
  const isTestnet = (url: string) => url?.includes(NetworkType.TESTNET);
  const isMainnet = (url: string) => url?.includes(NetworkType.MAINNET);

  const networkList = isWebAuthn
    ? networks
    : networks?.filter((net) => net.url === currentNetwork.url);

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
          {networkList && mode === NetworkDrawerMode.SELECT && (
            <VStack spacing={4}>
              <VStack spacing={2} w="full">
                {networkList.map((net) => {
                  const isSelected = net.url === currentNetwork.url;

                  return (
                    <Center
                      key={net.url}
                      w="full"
                      h={70}
                      opacity={selectNetworkRequest.isPending ? 0.5 : 1}
                      transition={'all 0.5s'}
                      bg={
                        isSelected
                          ? 'linear-gradient(45deg, #FFC010,#EBA312,#D38015,#B24F18)'
                          : 'grey.950'
                      }
                      borderRadius={8}
                    >
                      <HStack
                        cursor="pointer"
                        onClick={
                          selectNetworkRequest.isPending
                            ? undefined
                            : () => handleSelectNetwork(net.url)
                        }
                        w="calc(100% - 2px)"
                        h="calc(70px - 2px)"
                        px={4}
                        bg={isSelected ? 'grey.825' : 'dark.950'}
                        borderRadius={8}
                        spacing={4}
                      >
                        <Icon
                          as={isMainnet(net.url) ? BakoIcon : UnknownIcon}
                          fontSize={24}
                        />

                        <Text fontSize={14} fontWeight={500} color="grey.75">
                          {net?.name}
                        </Text>

                        <Box flex={1} />

                        {isWebAuthn && !isTestnet(net.url) && (
                          <Icon
                            as={RemoveIcon}
                            fontSize={16}
                            color={'grey.75'}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCustomNetwork(net);
                            }}
                            transition={'all 0.1s'}
                            _hover={{ color: 'grey.250' }}
                          />
                        )}
                      </HStack>
                    </Center>
                  );
                })}

                {isWebAuthn && (
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
                )}
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
                  control={networkForm.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <FormControl isInvalid={fieldState.invalid}>
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        placeholder=" "
                        variant="dark"
                        bg={'grey.825'}
                        border={'1px solid'}
                        borderColor={'grey.125'}
                        disabled={true}
                      />
                      <FormLabel>Name</FormLabel>
                      <FormHelperText color="error.500">
                        {fieldState.error?.message}
                      </FormHelperText>
                    </FormControl>
                  )}
                />

                <Controller
                  control={networkForm.control}
                  name="url"
                  rules={{ required: 'URL is required' }}
                  render={({ field, fieldState }) => (
                    <FormControl isInvalid={fieldState.invalid}>
                      <Input
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          networkForm.clearErrors();
                          setValidNetwork(false);
                        }}
                        placeholder=" "
                        variant="dark"
                        bg={'grey.825'}
                        border={'1px solid'}
                        borderColor={validNetwork ? 'brand.500' : 'grey.125'}
                      />
                      <FormLabel>URL</FormLabel>
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
                  onClick={handleCheckNetwork}
                  _hover={{ borderColor: 'inherit', color: 'inherit' }}
                  sx={{ _active: { bg: 'inherit' } }}
                  disabled={loadingCheck}
                >
                  {loadingCheck ? <Spinner w={4} h={4} /> : 'Test connection'}
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
