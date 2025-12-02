import { Box, Card, Field, Heading, HStack, Image, Text } from 'bako-ui';
import { Controller, useFormContext } from 'react-hook-form';

import { ChevronDownIcon } from '@/components';
import { Asset } from '@/modules/core';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useAmountBridge, useFormBridge } from '@/modules/vault/hooks/bridge';
import { limitCharacters } from '@/utils';

import { ModalSelectAssetsBridge } from '..';
import { ModalSelectNetworkBridge } from '../modalSelectNetwork';
import {
  ITransferBridgePayload,
  useFormBridgeContext,
} from '../providers/FormBridgeProvider';
import { BridgeStepsForm } from '../utils';

interface ToFormStepProps {
  assets?: Required<Asset>[];
  setErrorAmount: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ToFormStep = ({ assets, setErrorAmount }: ToFormStepProps) => {
  const { control, watch, resetField } =
    useFormContext<ITransferBridgePayload>();
  const { setStepForm } = useFormBridgeContext();
  const dialogSelectNetwork = useDisclosure();
  const dialogSelectAsset = useDisclosure();
  const { toAssetOptions, toNetworkOptions, isLoadingDestinations, amount } =
    useFormBridge();
  const { handleSourceChange } = useAmountBridge({ assets, setErrorAmount });

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
                        <Image
                          src={field?.value.image}
                          rounded="full"
                          boxSize={6}
                        />
                      )}
                      <Text
                        fontSize="sm"
                        color={field.value ? 'textPrimary' : 'textSecondary'}
                        lineClamp={1}
                        truncate
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
                </Box>
                {dialogSelectNetwork.isOpen && (
                  <ModalSelectNetworkBridge
                    isOpen
                    title="Select Network"
                    onOpenChange={dialogSelectNetwork.onOpenChange}
                    onClose={dialogSelectNetwork.onClose}
                    options={toNetworkOptions}
                    isLoadingOptions={isLoadingDestinations}
                    onSelect={(value) => {
                      resetField('selectAssetTo');
                      resetField('selectAssetToMobile');
                      // checkResetSteps();
                      field.onChange(value);
                    }}
                  />
                )}
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
                        <Image
                          src={field?.value.image}
                          boxSize={6}
                          rounded="full"
                        />
                      )}
                      <Text
                        fontSize="sm"
                        color={field.value ? 'textPrimary' : 'textSecondary'}
                        lineClamp={1}
                        truncate
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
                </Box>
                {dialogSelectAsset.isOpen && (
                  <ModalSelectAssetsBridge
                    isOpen
                    title="Select Asset"
                    onOpenChange={dialogSelectAsset.onOpenChange}
                    options={toAssetOptions}
                    onSelect={(value) => {
                      field.onChange(value);
                      setStepForm(BridgeStepsForm.AMOUNT);
                      // Trigger amount recalculation on asset change
                      if (amount) {
                        handleSourceChange(amount);
                      }
                    }}
                  />
                )}
              </Field.Root>
            )}
          />
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};
