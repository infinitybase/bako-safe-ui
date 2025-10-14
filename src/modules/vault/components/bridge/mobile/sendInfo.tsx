import { Card, Field, HStack, InputGroup, Text } from 'bako-ui';
import { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { AssetSelect } from '@/components';
import { IGetLimitsResponse } from '@/modules/core';
import { useFormBridge } from '@/modules/vault/hooks/bridge';

import { InputAddressBridge } from '..';
import { ITransferBridgePayload } from '../providers/FormBridgeProvider';

export interface SendInfoBridgeMobileProps {
  errorAmount: string | null;
  setErrorAmount: React.Dispatch<React.SetStateAction<string | null>>;
}

export function SendInfoBridgeMobile({
  errorAmount,
  setErrorAmount,
}: SendInfoBridgeMobileProps) {
  const { control } = useFormContext<ITransferBridgePayload>();
  const {
    toNetworkOptions,
    toAssetOptions,
    form,
    amount,
    getOperationLimits,
    getOperationQuotes,
    prepareCreateSwapPayload,
  } = useFormBridge();

  const handleCheckAmount = useCallback(
    (limits: IGetLimitsResponse) => {
      const amountTreated = Number(amount.replace(/,/g, ''));
      const hasMinAmount = amountTreated >= (limits.minAmount ?? 0);
      if (!hasMinAmount) {
        setErrorAmount(`Amount must be at least ${limits.minAmount}`);
      }
    },
    [amount, setErrorAmount],
  );

  return (
    <Card.Root padding={3} w="full" bgColor="grey.825" gap={4}>
      <Text color="grey.425" fontSize={12}>
        Send to
      </Text>

      <HStack gap={4} w="full">
        <Controller
          control={control}
          name="selectNetworkToMobile"
          render={({ field }) => (
            <Field.Root>
              <InputGroup position="relative" overflow="visible" zIndex={1}>
                <AssetSelect
                  {...field}
                  options={toNetworkOptions}
                  label={'Destination'}
                  boxProps={{ bg: 'grey.925', h: '45px', py: 2 }}
                  textLabelProps={{ left: 2.5 }}
                  onChange={(e) => {
                    field.onChange(e);
                    form.resetField('selectAssetToMobile');
                  }}
                />
              </InputGroup>
            </Field.Root>
          )}
        />

        <Controller
          control={control}
          name="selectAssetToMobile"
          render={({ field }) => (
            <Field.Root>
              <InputGroup position="relative" overflow="visible" zIndex={1}>
                <AssetSelect
                  {...field}
                  options={toAssetOptions.map((a) => {
                    return { ...a, symbol: null, name: a.symbol || a.name };
                  })}
                  label={'Asset'}
                  boxProps={{ bg: 'grey.925', h: '45px', py: 2 }}
                  textValueProps={{ color: 'grey.50' }}
                  textLabelProps={{ left: 2.5 }}
                  onChange={async (e) => {
                    field.onChange(e);
                    const option = toAssetOptions.find((a) => a.value === e);
                    const limits = await getOperationLimits(option);
                    const payload = prepareCreateSwapPayload();
                    payload.destinationToken = option?.symbol ?? '';
                    !errorAmount &&
                      (await getOperationQuotes(undefined, payload));
                    await handleCheckAmount(limits);
                  }}
                />
              </InputGroup>
            </Field.Root>
          )}
        />
      </HStack>

      <InputAddressBridge />
    </Card.Root>
  );
}
