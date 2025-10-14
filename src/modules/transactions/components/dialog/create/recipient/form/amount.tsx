import { Box, Button, Field, HStack, Text } from 'bako-ui';
import { memo, useMemo } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';

import { AmountInput } from '@/components';

import Clear from './clear';

interface RecipientFormAmountProps {
  index: number;
  value: string | undefined;
  onChange: (value: string) => void;
  isNFT: boolean;
  getAssetPrice: (assetId: string) => number;
  isLoadingFee: boolean;
  error?: FieldError;
  getBalanceAvailable: () => string;
}

const RecipientFormAmount = memo(
  ({
    value,
    onChange,
    error,
    isNFT,
    getAssetPrice,
    index,
    isLoadingFee,
    getBalanceAvailable,
  }: RecipientFormAmountProps) => {
    const { watch } = useFormContext();
    const asset = watch(`transactions.${index}.asset`);
    const assetPrice = useMemo(
      () => getAssetPrice(asset),
      [asset, getAssetPrice],
    );

    const usdEstimate = useMemo(() => {
      if (!value || !asset) return '$0.00';
      const estimated = parseFloat(value.replace(/,/g, '')) * assetPrice;

      return estimated.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }, [value, asset, assetPrice]);

    const usdNumber = useMemo(
      () => parseFloat(usdEstimate.replace(/[^\d.-]/g, '')),
      [usdEstimate],
    );

    return (
      <HStack align="start" gap={2} position="relative" width="100%">
        <Field.Root invalid={!!error?.message}>
          <Box position="relative" w="full">
            <AmountInput
              placeholder=" "
              value={isNFT ? '1' : value}
              onFocus={() => {
                if (value === '.00' || value === '0.00') {
                  value = '';
                }
              }}
              onChange={({ target }) => onChange(target.value)}
              isInvalid={!!error?.message}
              disabled={isNFT}
            />
            <Field.Label data-testid="transaction_amount">Amount</Field.Label>

            <Field.HelperText
              pl={4}
              color={error?.message ? 'error.500' : 'gray.400'}
            >
              {error?.message ? (
                <Text fontSize="sm" lineHeight="short">
                  {error.message}
                </Text>
              ) : !isNFT ? (
                <Text
                  fontSize="sm"
                  lineHeight="short"
                  color="grey.425"
                  opacity={usdNumber > 0 ? 1 : 0}
                >
                  ~ {usdEstimate}
                </Text>
              ) : null}
            </Field.HelperText>

            {!isNFT && (
              <HStack
                position="absolute"
                top="35%"
                right="0.75rem"
                gap={1}
                zIndex={1}
                bg="grey.825"
                transform="translateY(-50%)"
              >
                <Clear
                  position="relative"
                  transform="none"
                  onClear={() => onChange('')}
                />
                <Button
                  size="xs"
                  bg="transparent"
                  border="1px solid "
                  borderColor="white"
                  borderRadius="md"
                  color={'white'}
                  fontWeight="bold"
                  lineHeight="1"
                  _hover={{
                    bg: 'grey.900',
                  }}
                  _active={{
                    bg: 'grey.850',
                  }}
                  disabled={isLoadingFee}
                  onClick={() => {
                    const max = getBalanceAvailable();
                    onChange(max);
                  }}
                >
                  MAX
                </Button>
              </HStack>
            )}
          </Box>
        </Field.Root>
      </HStack>
    );
  },
);

RecipientFormAmount.displayName = 'RecipientFormAmount';

export default RecipientFormAmount;
