import { Field, HStack, Loader, Text } from 'bako-ui';
import { bn } from 'fuels';
import { memo, useCallback, useMemo } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';

import { AssetSelect, AssetSelectOption } from '@/components';
import { UseVaultDetailsReturn } from '@/modules';

interface RecipientFormAssetProps {
  assets: UseVaultDetailsReturn['assets'];
  index: number;
  assetsOptions: AssetSelectOption[];
  isFeeCalcLoading: boolean;
  balanceAvailable: string;
  isNFT: boolean;
  isNFTAsset: (value: string) => boolean;
  isInvalid: boolean;
  value?: string;
  error?: FieldError;
  onChange: (value: string) => void;
}

const RecipientFormAsset = ({
  assets,
  assetsOptions,
  balanceAvailable,
  index,
  isFeeCalcLoading,
  isNFT,
  isNFTAsset,
  isInvalid,
  value,
  onChange,
  error,
}: RecipientFormAssetProps) => {
  const { setValue } = useFormContext();

  const handleUpdateAmount = useCallback(
    (isNFT: boolean, value: string) => {
      onChange(value);
      if (isNFT) {
        setValue(`transactions.${index}.amount`, bn(1).format());
        return;
      }
      setValue(`transactions.${index}.amount`, '');
    },
    [index, setValue, onChange],
  );

  const slug = useMemo(
    () => assets.getAssetInfo(value || '')?.slug,
    [assets, value],
  );

  return (
    <HStack
      align="start"
      gap={2}
      position="relative"
      width="100%"
      data-testid="transaction_asset"
    >
      <Field.Root invalid={!!error?.message}>
        <AssetSelect
          isInvalid={isInvalid}
          options={assetsOptions}
          placeholder="Select Token"
          name={`transaction.${index}.asset`}
          value={value}
          onChange={(e) => {
            handleUpdateAmount(isNFTAsset(e), e);
          }}
          isLoading={assets.isLoading}
        />
        {value && (
          <Field.HelperText color={error?.message ? 'error.500' : 'grey.425'}>
            {!isNFT && (
              <Text display="flex" alignItems="center" mt={1}>
                {parseFloat(balanceAvailable) > 0 ? (
                  isFeeCalcLoading ? (
                    <>
                      Balance (available):{' '}
                      <Loader
                        css={{ '--spinner-track-color': 'dark.100' }}
                        size="xs"
                        color="grey.425"
                        ml={1}
                      />
                    </>
                  ) : (
                    <>
                      Balance (available): {slug} {balanceAvailable}
                    </>
                  )
                ) : null}
              </Text>
            )}
          </Field.HelperText>
        )}
      </Field.Root>
    </HStack>
  );
};

export default memo(RecipientFormAsset);
