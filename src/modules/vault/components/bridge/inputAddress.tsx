import {
  Card,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { LineCloseIcon } from '@/components';
import { useScreenSize } from '@/modules/core';

import { ITransferBridgePayload } from '../../pages';

export function InputAddressBridge() {
  const { control } = useFormContext<ITransferBridgePayload>();
  const [isFocused, setIsFocused] = useState(false);
  const { isMobile } = useScreenSize();

  return (
    <Card
      variant="outline"
      padding={isMobile ? 0 : 3}
      w="full"
      boxShadow="none"
    >
      <VStack p={0} gap={1} align={'flex-start'} w="full">
        {!isMobile && (
          <Text color="#868079" fontSize={12} flex={1}>
            Destination address
          </Text>
        )}
        <Controller
          control={control}
          name="destinationAddress"
          render={({ field, fieldState }) => (
            <FormControl isInvalid={fieldState.invalid} paddingTop={0}>
              <InputGroup
                sx={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  '> input': {
                    paddingTop: 0,
                    paddingBottom: 0,
                    height: '46px',
                  },
                }}
              >
                <InputRightElement top="35%" width="1.5rem" cursor="pointer">
                  <LineCloseIcon
                    color="grey.75"
                    fontSize="16px"
                    onClick={() => field.onChange('')}
                  />
                </InputRightElement>

                <Input
                  value={field.value?.trimStart()}
                  onChange={field.onChange}
                  placeholder=" "
                  variant="dark"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  paddingTop={0}
                />
                {!isFocused && !field.value && (
                  <FormLabel
                    id="destination_addr"
                    fontSize={'14px !important'}
                    color={'#AAA6A1 !important'}
                    paddingTop={0}
                  >
                    {'Enter address'}
                  </FormLabel>
                )}
              </InputGroup>
              <FormHelperText paddingTop={0} color="error.500">
                {fieldState.error?.message}
              </FormHelperText>
            </FormControl>
          )}
        />
      </VStack>
    </Card>
  );
}
