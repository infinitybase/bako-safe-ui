import { Card, Field, Input, InputGroup, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { LineCloseIcon } from '@/components';
import { AddressUtils, useScreenSize } from '@/modules/core';

import { ITransferBridgePayload } from './providers/FormBridgeProvider';

export function InputAddressBridge() {
  const { control } = useFormContext<ITransferBridgePayload>();
  const [isFocused, setIsFocused] = useState(false);
  const { isMobile } = useScreenSize();

  return (
    <Card.Root
      variant="outline"
      padding={isMobile ? 0 : 3}
      w="full"
      boxShadow="none"
    >
      <VStack p={0} gap={1} align={'flex-start'} w="full">
        {!isMobile && (
          <Text color="grey.425" fontSize={12} flex={1}>
            Destination address
          </Text>
        )}
        <Controller
          control={control}
          name="destinationAddress"
          render={({ field, fieldState }) => {
            const minLengthAddress = 40;
            const displayValue =
              field?.value?.length > minLengthAddress
                ? AddressUtils.format(field?.value ?? '')
                : field?.value;

            return (
              <Field.Root invalid={fieldState.invalid} paddingTop={0}>
                <InputGroup
                  endElement={
                    <LineCloseIcon
                      color="grey.75"
                      fontSize="16px"
                      onClick={() => field.onChange('')}
                    />
                  }
                  css={{
                    paddingTop: 0,
                    paddingBottom: 0,
                    '> input': {
                      paddingTop: 0,
                      paddingBottom: 0,
                      height: '46px',
                    },
                  }}
                >
                  <Input
                    value={displayValue}
                    onChange={field.onChange}
                    placeholder=" "
                    // variant="dark"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    paddingTop={0}
                  />
                </InputGroup>
                {!isFocused && !field.value && (
                  <Field.Label
                    id="destination_addr"
                    fontSize={'14px !important'}
                    color={'grey.250 !important'}
                    paddingTop={0}
                  >
                    {'Enter address'}
                  </Field.Label>
                )}
                <Field.HelperText paddingTop={0} color="error.500">
                  {fieldState.error?.message}
                </Field.HelperText>
              </Field.Root>
            );
          }}
        />
      </VStack>
    </Card.Root>
  );
}
