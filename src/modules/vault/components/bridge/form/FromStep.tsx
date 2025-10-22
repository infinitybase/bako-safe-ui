import { Card, Field, Heading, HStack, InputGroup } from 'bako-ui';
import { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { AssetSelect } from '@/components';
import { useNetworks } from '@/modules/network/hooks';
import { useFormBridge } from '@/modules/vault/hooks/bridge';

import { ITransferBridgePayload } from '../providers/FormBridgeProvider';
import { SelectNetworkProps } from '../selectNewtork';
import { getFuelAssetsByNetwork, optionsNets } from '../utils';

export const FromFormStep = ({
  setStepsForm,
  stepsForm,
}: Omit<SelectNetworkProps, 'setErrorAmount'>) => {
  const { control, resetField, setValue } =
    useFormContext<ITransferBridgePayload>();
  const { currentNetwork } = useNetworks();
  const { getDestinations } = useFormBridge();

  const checkResetSteps = useCallback(() => {
    if (stepsForm > 0) {
      setTimeout(() => {
        setStepsForm(0);
        setValue('amount', '0.000');
      }, 200);
    }
  }, [stepsForm, setValue, setStepsForm]);

  return (
    <Card.Root variant="subtle" bg="bg.panel" w="full" rounded="2xl">
      <Card.Body flexDirection="row" gap={4} alignItems="center">
        <Heading
          color="textPrimary"
          fontSize="sm"
          letterSpacing="widest"
          lineHeight="shorter"
        >
          From
        </Heading>
        <HStack gap={3} flex={1}>
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
                    readonly
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
                    label={!field.value ? 'Select token' : undefined}
                    onChange={(e) => {
                      field.onChange(e);
                      checkResetSteps();
                      resetField('selectNetworkTo');
                      resetField('selectNetworkToMobile');
                      resetField('selectAssetToMobile');
                      resetField('selectAssetTo');
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
      </Card.Body>
    </Card.Root>
  );
};
