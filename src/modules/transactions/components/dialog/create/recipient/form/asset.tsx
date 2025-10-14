import { Field, HStack, Loader, Text } from 'bako-ui';
import { bn } from 'fuels';
import { memo, useCallback, useMemo } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';

import { AssetSelectOption } from '@/components';
import { AssetSelect, UseVaultDetailsReturn } from '@/modules';

import Clear from './clear';

interface RecipientFormAssetProps {
  assets: UseVaultDetailsReturn['assets'];
  index: number;
  assetsOptions: AssetSelectOption[];
  isFeeCalcLoading: boolean;
  balanceAvailable: string;
  isNFT: boolean;
  isNFTAsset: (value: string) => boolean;
  onClearValue: () => void;
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
  onClearValue,
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
      <AssetSelect
        isInvalid={isInvalid}
        options={assetsOptions}
        name={`transaction.${index}.asset`}
        value={value}
        onChange={(e) => {
          handleUpdateAmount(isNFTAsset(e), e);
        }}
        helperText={
          <Field.HelperText color={error?.message ? 'error.500' : 'grey.425'}>
            {!isNFT && (
              <Text display="flex" alignItems="center" mt={1}>
                {!value ? (
                  'Select an asset to see the balance'
                ) : parseFloat(balanceAvailable) > 0 ? (
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
        }
      />
      {!!value && <Clear top={isNFT ? '47%' : '38%'} onClear={onClearValue} />}
    </HStack>
  );
};

export default memo(RecipientFormAsset);
