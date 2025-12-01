import { Button, Field, HStack, InputGroup, Text } from 'bako-ui';
import { memo, useMemo } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';

import { AmountInput } from '@/components';

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
          <InputGroup
            endElement={
              <>
                {!isNFT && (
                  <Button
                    size="2xs"
                    borderRadius="lg"
                    lineHeight="1"
                    variant="ghost"
                    disabled={isLoadingFee}
                    onClick={() => {
                      const max = getBalanceAvailable();
                      onChange(max);
                    }}
                  >
                    MAX
                  </Button>
                )}
              </>
            }
          >
            <AmountInput
              placeholder="Amount"
              variant="subtle"
              value={isNFT ? '1' : value}
              onFocus={() => {
                if (value === '.00' || value === '0.00') {
                  value = '';
                }
              }}
              pt={value || isNFT ? 2 : 0}
              onChange={({ target }) => onChange(target.value)}
              isInvalid={!!error?.message}
              disabled={isNFT}
              bg="gray.550"
            />
          </InputGroup>

          <Field.HelperText color={error?.message ? 'red' : 'gray.400'}>
            {error?.message ? (
              <Text fontSize="sm" lineHeight="short">
                {error.message}
              </Text>
            ) : !isNFT ? (
              <Text
                fontSize="sm"
                lineHeight="short"
                color="gray.400"
                opacity={usdNumber > 0 ? 1 : 0}
              >
                ~ {usdEstimate}
              </Text>
            ) : null}
          </Field.HelperText>
        </Field.Root>
      </HStack>
    );
  },
);

RecipientFormAmount.displayName = 'RecipientFormAmount';

export default RecipientFormAmount;
