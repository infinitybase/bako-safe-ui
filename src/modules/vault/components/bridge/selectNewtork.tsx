import {
  Box,
  Card,
  Field,
  HStack,
  IconButton,
  Image,
  InputGroup,
  Separator,
  Text,
  VStack,
} from 'bako-ui';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { AssetSelect, ChevronDownIcon, SwapIcon } from '@/components';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useNetworks } from '@/modules/network/hooks';
import { limitCharacters } from '@/utils';

import { useFormBridge } from '../../hooks/bridge';
import { ModalSelectAssetsBridge } from './modalSelectAssets';
import { ModalSelectNetworkBridge } from './modalSelectNetwork';
import { ITransferBridgePayload } from './providers/FormBridgeProvider';
import { getFuelAssetsByNetwork, optionsNets } from './utils';

export interface SelectNetworkProps {
  stepsForm: number;
  setStepsForm: React.Dispatch<React.SetStateAction<number>>;
}

export interface NetworkOptionItem {
  value: string;
  image: string;
  name: string;
  symbol: string;
}

const MotionBox = motion(Box);

export function SelectBridgeNetwork({
  stepsForm,
  setStepsForm,
}: SelectNetworkProps) {
  const { control } = useFormContext<ITransferBridgePayload>();
  const dialogSelectNetwork = useDisclosure();
  const dialogSelectAsset = useDisclosure();
  const {
    toNetworkOptions,
    toAssetOptions,
    form,
    isLoadingDestinations,
    getDestinations,
  } = useFormBridge();
  const { currentNetwork } = useNetworks();

  const networkToValue = useWatch({
    control,
    name: 'selectNetworkTo',
  });

  const assetFromValue = useWatch({
    control,
    name: 'selectAssetFrom',
  });

  const checkResetSteps = useCallback(() => {
    if (stepsForm > 0) {
      setTimeout(() => {
        setStepsForm(0);
        form.setValue('amount', '0.000');
      }, 200);
    }
  }, [stepsForm, form, setStepsForm]);

  return (
    <VStack
      w={stepsForm === 0 ? '456px' : '430px'}
      transition="width 0.3s ease"
    >
      <Card.Root variant="outline" padding={3} w="full" zIndex={1}>
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
                <Text color="grey.250" fontSize={12}>
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
              <Field.Root>
                <InputGroup position="relative" overflow="visible" zIndex={1}>
                  <AssetSelect
                    {...field}
                    options={optionsNets}
                    value={
                      optionsNets.find((opt) => opt.name === 'Fuel Ignition')
                        ?.value
                    }
                    isDisabled={true}
                    boxProps={{ bg: 'grey.925', h: '45px' }}
                  />
                </InputGroup>
              </Field.Root>
            )}
          />

          <Controller
            control={control}
            name="selectAssetFrom"
            render={({ field }) => (
              <Field.Root>
                <InputGroup position="relative" overflow="visible" zIndex={1}>
                  <AssetSelect
                    {...field}
                    options={getFuelAssetsByNetwork(currentNetwork)}
                    label={!field.value ? 'Asset' : undefined}
                    boxProps={{ bg: 'grey.925', h: '45px' }}
                    textValueProps={{ color: 'grey.50' }}
                    onChange={(e) => {
                      field.onChange(e);
                      checkResetSteps();
                      form.resetField('selectNetworkTo');
                      form.resetField('selectNetworkToMobile');
                      form.resetField('selectAssetToMobile');
                      form.resetField('selectAssetTo');
                      const asset = getFuelAssetsByNetwork(currentNetwork).find(
                        (a) => a.value === e,
                      );
                      getDestinations(asset);
                    }}
                  />
                </InputGroup>
              </Field.Root>
            )}
          />
        </HStack>

        <HStack marginY={4}>
          <Separator w="full" borderColor="grey.950" />
          <IconButton
            variant="ghost"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="grey.550"
            fontSize="xl"
            boxSize="24px"
            minW="24px"
            px={0}
            aria-label="Bridge"
          >
            <SwapIcon />
          </IconButton>
          <Separator w="full" borderColor="grey.950" />
        </HStack>

        <HStack mb={2}>
          <Text color="grey.250" fontSize={12}>
            To
          </Text>
        </HStack>

        <HStack>
          <Controller
            control={control}
            name="selectNetworkTo"
            render={({ field }) => (
              <Field.Root>
                <Box
                  position="relative"
                  w="full"
                  h="45px"
                  px={5}
                  py={3}
                  bg="grey.925"
                  border="1px solid"
                  borderColor={'grey.800'}
                  borderRadius={10}
                  aria-label={'Select a network'}
                  cursor={!assetFromValue ? 'not-allowed' : 'pointer'}
                  opacity={!assetFromValue ? 0.5 : 1}
                  aria-disabled={!assetFromValue}
                  onClick={
                    assetFromValue ? dialogSelectNetwork.onOpen : undefined
                  }
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
                          : 'Network'}
                      </Text>
                    </HStack>

                    <ChevronDownIcon
                      fontSize="20px"
                      color="grey.75"
                      transform="translateY(2px)"
                    />
                  </HStack>

                  <ModalSelectNetworkBridge
                    title="Select Network"
                    isOpen={dialogSelectNetwork.isOpen}
                    onClose={dialogSelectNetwork.onClose}
                    options={toNetworkOptions}
                    isLoadingOptions={isLoadingDestinations}
                    onSelect={(value) => {
                      form.resetField('selectAssetTo');
                      form.resetField('selectAssetToMobile');
                      checkResetSteps();
                      field.onChange(value);
                    }}
                  />
                </Box>
              </Field.Root>
            )}
          />

          <Controller
            control={control}
            name="selectAssetTo"
            render={({ field }) => (
              <Field.Root>
                <Box
                  position="relative"
                  w="full"
                  h="45px"
                  px={5}
                  py={3}
                  bg="grey.925"
                  border="1px solid"
                  borderColor={'grey.800'}
                  borderRadius={10}
                  aria-label={'Select an asset'}
                  cursor={!networkToValue ? 'not-allowed' : 'pointer'}
                  opacity={!networkToValue ? 0.5 : 1}
                  aria-disabled={!networkToValue}
                  onClick={
                    networkToValue ? dialogSelectAsset.onOpen : undefined
                  }
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
                    isOpen={dialogSelectAsset.isOpen}
                    onOpenChange={dialogSelectAsset.onOpenChange}
                    options={toAssetOptions}
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
              </Field.Root>
            )}
          />
        </HStack>
      </Card.Root>
    </VStack>
  );
}
