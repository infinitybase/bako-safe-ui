import { Box, Card, Field, Heading, HStack, Image, Text } from 'bako-ui';
import { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { ChevronDownIcon } from '@/components';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useFormBridge } from '@/modules/vault/hooks/bridge';
import { limitCharacters } from '@/utils';

import { ModalSelectAssetsBridge } from '..';
import { ModalSelectNetworkBridge } from '../modalSelectNetwork';
import { ITransferBridgePayload } from '../providers/FormBridgeProvider';
import { SelectNetworkProps } from '../selectNewtork';

export const ToFormStep = ({ setStepsForm, stepsForm }: SelectNetworkProps) => {
  const { control, watch, setValue, resetField } =
    useFormContext<ITransferBridgePayload>();
  const dialogSelectNetwork = useDisclosure();
  const dialogSelectAsset = useDisclosure();
  const { toAssetOptions, toNetworkOptions, isLoadingDestinations } =
    useFormBridge();

  const checkResetSteps = useCallback(() => {
    if (stepsForm > 0) {
      setTimeout(() => {
        setStepsForm(0);
        setValue('amount', '0.000');
      }, 200);
    }
  }, [stepsForm, setValue, setStepsForm]);

  const assetFromValue = watch('selectAssetFrom');
  const networkToValue = watch('selectNetworkTo');

  return (
    <Card.Root variant="subtle" bg="bg.panel" w="full" rounded="2xl">
      <Card.Body flexDirection="row" gap={4} alignItems="center">
        <Heading
          color="textPrimary"
          fontSize="sm"
          letterSpacing="widest"
          lineHeight="shorter"
        >
          To
        </Heading>
        <HStack gap={3} flex={1} justifyContent="flex-end">
          <Controller
            control={control}
            name="selectNetworkTo"
            render={({ field }) => (
              <Field.Root maxW="170px">
                <Box
                  position="relative"
                  display="flex"
                  w="full"
                  h="40px"
                  px={3}
                  bg="bg.muted"
                  borderRadius="sm"
                  aria-label={'Select a network'}
                  cursor={!assetFromValue ? 'not-allowed' : 'pointer'}
                  opacity={!assetFromValue ? 0.5 : 1}
                  aria-disabled={!assetFromValue}
                  onClick={
                    assetFromValue ? dialogSelectNetwork.onOpen : undefined
                  }
                  {...field}
                >
                  <HStack w="100%" justify="space-between" alignItems="center">
                    <HStack>
                      {field?.value && (
                        <Image src={field?.value.image} boxSize={6} />
                      )}
                      <Text
                        fontSize="sm"
                        color={field.value ? 'textPrimary' : 'textSecondary'}
                      >
                        {field.value
                          ? limitCharacters(field.value.name ?? '', 10)
                          : 'Network'}
                      </Text>
                    </HStack>

                    <ChevronDownIcon
                      fontSize="20px"
                      color="textPrimary"
                      transform="translateY(2px)"
                    />
                  </HStack>

                  <ModalSelectNetworkBridge
                    title="Select Network"
                    isOpen={dialogSelectNetwork.isOpen}
                    onOpenChange={dialogSelectNetwork.onOpenChange}
                    onClose={dialogSelectNetwork.onClose}
                    options={toNetworkOptions}
                    isLoadingOptions={isLoadingDestinations}
                    onSelect={(value) => {
                      resetField('selectAssetTo');
                      resetField('selectAssetToMobile');
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
              <Field.Root maxW="170px">
                <Box
                  position="relative"
                  w="full"
                  display="flex"
                  h="40px"
                  px={3}
                  bg="bg.muted"
                  borderRadius="sm"
                  aria-label={'Select an asset'}
                  cursor={!networkToValue ? 'not-allowed' : 'pointer'}
                  opacity={!networkToValue ? 0.5 : 1}
                  aria-disabled={!networkToValue}
                  onClick={
                    networkToValue ? dialogSelectAsset.onOpen : undefined
                  }
                  {...field}
                >
                  <HStack w="100%" justify="space-between" alignItems="center">
                    <HStack>
                      {field?.value && (
                        <Image src={field?.value.image} boxSize={6} />
                      )}
                      <Text
                        fontSize="sm"
                        color={field.value ? 'textPrimary' : 'textSecondary'}
                      >
                        {field.value
                          ? limitCharacters(field.value.name ?? '', 10)
                          : 'Asset'}
                      </Text>
                    </HStack>

                    <ChevronDownIcon
                      fontSize="20px"
                      color="textPrimary"
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
      </Card.Body>
    </Card.Root>
  );
};
