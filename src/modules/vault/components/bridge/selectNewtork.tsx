import {
  Box,
  Card,
  Divider,
  FormControl,
  HStack,
  IconButton,
  Image,
  InputGroup,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { AssetSelect, ChevronDownIcon, SwapIcon } from '@/components';
import { limitCharacters } from '@/utils';

import { ITransferBridgePayload } from '../../pages';
import { ModalSelectAssetsBridge } from './modalSelectAssets';

export interface SelectNetworkProps {
  stepsForm: number;
  setStepsForm: React.Dispatch<React.SetStateAction<number>>;
}
const MotionBox = motion(Box);

export function SelectBridgeNetwork({
  stepsForm,
  setStepsForm,
}: SelectNetworkProps) {
  const { control } = useFormContext<ITransferBridgePayload>();
  const dialogSelectNetwork = useDisclosure();

  const networkValue = useWatch({
    control,
    name: 'selectNetworkTo',
  });

  const optionsAssets = [
    {
      value:
        '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07',
      name: 'ETH',
      image: 'https://assets.fuel.network/providers/eth.svg',
      symbol: null,
    },
    {
      value:
        '0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82',
      name: 'FUEL',
      image: 'https://verified-assets.fuel.network/images/fuel.svg',
      symbol: null,
    },
    {
      value: 'USDC',
      name: 'USDC',
      image:
        'https://firebasestorage.googleapis.com/v0/b/pump-555ee.appspot.com/o/images%2Faecb0358-d860-402c-9f3c-c5b579e4eb88.jpeg?alt=media&token=b39c9a29-4b5e-4b2c-8600-62e9afff2448',
      symbol: null,
    },
  ];

  const optionsNets = [
    {
      value: 'Network ethereum',
      name: 'Ethereum',
      image: 'https://assets.fuel.network/providers/eth.svg',
      symbol: null,
    },
    {
      value: 'Network Fuel Ignition',
      name: 'Fuel Ignition',
      image: 'https://verified-assets.fuel.network/images/fuel.svg',
      symbol: null,
    },
    {
      value: 'Network Base',
      name: 'Base',
      image:
        'https://firebasestorage.googleapis.com/v0/b/pump-555ee.appspot.com/o/images%2Faecb0358-d860-402c-9f3c-c5b579e4eb88.jpeg?alt=media&token=b39c9a29-4b5e-4b2c-8600-62e9afff2448',
      symbol: null,
    },
  ];

  return (
    <VStack
      w={stepsForm === 0 ? '456px' : '430px'}
      transition="width 0.3s ease"
    >
      <Card variant="outline" padding={3} w="full" zIndex={1}>
        <AnimatePresence mode="wait">
          {stepsForm < 2 && (
            <MotionBox
              key="from-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              overflow="hidden"
            >
              <HStack mb={2}>
                <Text color="#AAA6A1" fontSize={12}>
                  From
                </Text>
              </HStack>
            </MotionBox>
          )}
        </AnimatePresence>

        <HStack gap={4}>
          <Controller
            control={control}
            name="selectNetworkFrom"
            render={({ field }) => (
              <FormControl>
                <InputGroup position="relative" overflow="visible" zIndex={1}>
                  <AssetSelect
                    {...field}
                    options={optionsNets}
                    value={
                      optionsNets.find((opt) => opt.name === 'Fuel Ignition')
                        ?.value
                    }
                    isDisabled={true}
                    boxProps={{ bg: 'grey.925' }}
                  />
                </InputGroup>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="selectAssetFrom"
            render={({ field }) => (
              <FormControl>
                <InputGroup position="relative" overflow="visible" zIndex={1}>
                  <AssetSelect
                    {...field}
                    options={optionsAssets}
                    label={!field.value ? 'Asset' : undefined}
                    boxProps={{ bg: 'grey.925' }}
                    textValueProps={{ color: 'grey.50' }}
                  />
                </InputGroup>
              </FormControl>
            )}
          />
        </HStack>

        <HStack marginY={4}>
          <Divider w="full" borderColor="grey.950" />
          <IconButton
            icon={<SwapIcon />}
            variant="unstyled"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="grey.550"
            fontSize="xl"
            boxSize="24px"
            minW="24px"
            px={0}
            aria-label="Bridge"
          />
          <Divider w="full" borderColor="grey.950" />
        </HStack>

        <HStack mb={2}>
          <Text color="#AAA6A1" fontSize={12}>
            To
          </Text>
        </HStack>

        <HStack>
          <Controller
            control={control}
            name="selectNetworkTo"
            render={({ field }) => (
              <FormControl>
                <InputGroup position="relative" overflow="visible">
                  <AssetSelect
                    {...field}
                    options={optionsNets}
                    label={!field.value ? 'Destination' : undefined}
                    boxProps={{ bg: 'grey.925' }}
                    textValueProps={{ color: 'grey.50' }}
                  />
                </InputGroup>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="selectAssetTo"
            render={({ field }) => (
              <FormControl>
                <Box
                  position="relative"
                  w="full"
                  h="50px"
                  px={5}
                  py={3}
                  bg="grey.925"
                  border="1px solid"
                  borderColor={'grey.800'}
                  borderRadius={10}
                  aria-label={'Select an asset'}
                  cursor={!networkValue ? 'not-allowed' : 'pointer'}
                  opacity={!networkValue ? 0.5 : 1}
                  aria-disabled={!networkValue}
                  onClick={() => dialogSelectNetwork.onOpen()}
                  {...field}
                >
                  <HStack w="100%" justify="space-between">
                    <HStack>
                      {field?.value && (
                        <Image src={field?.value.image} boxSize={6} />
                      )}
                      <Text
                        fontSize={field.value ? '14px' : 'md'}
                        color={field.value ? 'grey.50' : 'grey.400'}
                        fontWeight={400}
                      >
                        {field.value
                          ? limitCharacters(field.value.name ?? '', 10)
                          : 'Asset'}
                      </Text>
                    </HStack>

                    <ChevronDownIcon
                      fontSize="20px"
                      color="grey.75"
                      transform="translateY(2px)"
                    />
                  </HStack>

                  <ModalSelectAssetsBridge
                    title="Select Asset"
                    isOpen={dialogSelectNetwork.isOpen}
                    onClose={dialogSelectNetwork.onClose}
                    onSelect={(value) => {
                      field.onChange(value);
                      if (stepsForm === 0) {
                        setTimeout(() => {
                          setStepsForm(1);
                        }, 500);
                      }
                    }}
                  />
                </Box>
              </FormControl>
            )}
          />
        </HStack>
      </Card>
    </VStack>
  );
}
