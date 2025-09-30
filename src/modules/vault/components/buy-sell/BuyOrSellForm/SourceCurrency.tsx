import {
  Button,
  ButtonGroup,
  Flex,
  InputGroup,
  InputRightAddon,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { bn } from 'fuels';
import { useMemo, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { CurrencyCode, CurrencyField } from '@/components';
import { SelectedCurrency } from '@/modules/core/components';
import { ICreateWidgetPayload } from '@/modules/core/models/meld';
import {
  useListCryptoCurrencies,
  useListFiatCurrencies,
} from '@/modules/vault/hooks';
import {
  formatMeldEthSlug,
  parseToBN,
  splitToFiat,
} from '@/modules/vault/utils';
import { useVaultInfosContext } from '@/modules/vault/VaultInfosProvider';
import { moneyFormat } from '@/utils';
import { FUEL_ETH_ID } from '@/utils/constants';
import mergeRefs from '@/utils/merge-refs';

import { CardRoot } from '../CardRoot';
import { CurrencyOptionsModal } from '../CurrencyOptionsModal';
import { InputMirror } from '../InputMirror';

export const SourceCurrency = ({
  maxAmount,
  minAmount,
  isOnRamp,
}: {
  minAmount?: number;
  maxAmount?: number;
  isOnRamp: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fiatCurrencies, isLoading: isLoadingCurrencies } =
    useListFiatCurrencies();
  const { assets } = useVaultInfosContext();
  const { cryptoCurrencies, isLoading: isLoadingCryptoCurrencies } =
    useListCryptoCurrencies();

  const {
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<ICreateWidgetPayload>();
  const currencyModal = useDisclosure();

  const currentCurrencyCode = watch('sourceCurrencyCode');
  const fuelEthAsset = useMemo(
    () => assets.assets?.find((asset) => asset.assetId === FUEL_ETH_ID),
    [assets],
  );

  const handleCurrencyChange = (currencyCode: string) => {
    setValue('sourceCurrencyCode', currencyCode);
    currencyModal.onClose();
  };
  const currencyOptions = isOnRamp ? fiatCurrencies : cryptoCurrencies;

  const currentCurrency = useMemo(
    () =>
      currencyOptions.find(
        (currency) => currency.currencyCode === currentCurrencyCode,
      ),
    [currencyOptions, currentCurrencyCode],
  );

  const isLoading = isLoadingCryptoCurrencies || isLoadingCurrencies;
  const currencies = useMemo(
    () =>
      currencyOptions.map((currency) => ({
        label: currency.name,
        value: currency.currencyCode,
        imageUrl: currency.symbolImageUrl,
      })),
    [currencyOptions],
  );

  const ethAmount = useMemo(
    () => bn(fuelEthAsset?.amount ?? 0),
    [fuelEthAsset],
  );
  const handleSetCurrencyAmount = (percentage: number) => {
    const percentageAmount = ethAmount.mul(percentage).div(100);
    setValue('sourceAmount', percentageAmount.format({ precision: 9 }));
    trigger('sourceAmount');
  };

  const fiatLocale = useMemo(
    () => (currentCurrency?.currencyCode === 'BRL' ? 'pt-BR' : 'en-US'),
    [currentCurrency],
  );

  return (
    <CardRoot>
      <Flex justifyContent="space-between" alignItems="flex-start">
        <Text color="section.500" fontSize="sm">
          {isOnRamp ? 'You pay' : 'You sell'}
        </Text>

        <Flex flexDirection="column" alignItems="flex-end">
          <Controller
            control={control}
            name="sourceCurrencyCode"
            defaultValue=""
            render={() => (
              <SelectedCurrency
                onClick={currencyModal.onOpen}
                imageUrl={currentCurrency?.symbolImageUrl}
                name={currentCurrency?.name}
                isLoadingCurrencies={isLoading}
              />
            )}
          />
          {!isOnRamp && fuelEthAsset && (
            <Text color="section.500" fontSize="sm">
              Balance: {ethAmount.format({ precision: 9 })} ETH
            </Text>
          )}
          <CurrencyOptionsModal
            open={currencyModal.isOpen}
            onClose={currencyModal.onClose}
            onCurrencyChange={handleCurrencyChange}
            currentCurrencyCode={currentCurrencyCode}
            currencies={currencies}
            isLoading={isLoading}
            title="Select your currency"
            description="Set the currency you want to withdraw to."
          />
        </Flex>
      </Flex>

      <Stack justifyContent="center" alignItems="center">
        <Controller
          control={control}
          name="sourceAmount"
          rules={{
            required: 'Source amount is required',
            validate: {
              positive: (value) => {
                if (value && parseToBN(value, fiatLocale).lte(0)) {
                  return 'Source amount must be greater than 0';
                }
              },
              min: (value) => {
                if (
                  minAmount &&
                  parseToBN(value, fiatLocale).lt(
                    parseToBN(minAmount.toString(), 'en-US'),
                  )
                ) {
                  return `Source amount must be greater than ${moneyFormat(splitToFiat(minAmount, fiatLocale), fiatLocale)}`;
                }
              },
              max: (value) => {
                if (
                  maxAmount &&
                  parseToBN(value, fiatLocale).gt(
                    parseToBN(maxAmount.toString(), 'en-US'),
                  )
                ) {
                  return `Source amount must be less than ${moneyFormat(splitToFiat(maxAmount, fiatLocale), fiatLocale)}`;
                }
                if (!isOnRamp && ethAmount.lt(bn.parseUnits(value, 9))) {
                  return `You don't have enough ETH to sell`;
                }
              },
            },
          }}
          defaultValue="0"
          render={({ field: { value, onChange, ref, ...rest } }) => (
            <Stack
              w="fit-content"
              alignItems="center"
              pb={isOnRamp ? 16 : 2}
              pt={5}
            >
              <InputGroup
                alignItems="center"
                justifyContent="center"
                borderBottom="1px solid"
                borderColor={errors.sourceAmount ? 'red.500' : 'grey.950'}
                _focusWithin={{
                  borderColor: errors.sourceAmount ? 'red.500' : 'grey.200',
                }}
                _hover={{
                  borderColor: errors.sourceAmount ? 'red.500' : 'grey.200',
                }}
                px={0}
                minW={0}
                w="fit-content"
                gap={2}
              >
                <CurrencyField
                  type={isOnRamp ? 'fiat' : 'crypto'}
                  currency={
                    isOnRamp ? (currentCurrencyCode as CurrencyCode) : undefined
                  }
                  isInvalid={!!errors.sourceAmount}
                  textAlign="center"
                  borderBottomWidth="0"
                  minW={0}
                  px={0}
                  fontSize="3xl"
                  {...(rest as any)}
                  ref={mergeRefs(ref, inputRef)}
                  value={value}
                  onChange={onChange}
                />
                <InputMirror
                  inputRef={inputRef}
                  value={
                    isOnRamp
                      ? moneyFormat(value, fiatLocale, {
                          currency: currentCurrency?.currencyCode || 'USD',
                          style: 'decimal',
                        })
                      : value || '0'
                  }
                  isValueWithDecimals={isOnRamp}
                />
                <InputRightAddon alignSelf="end" color="section.200" px={0}>
                  {currentCurrency?.currencyCode &&
                    formatMeldEthSlug(currentCurrency.currencyCode)}
                </InputRightAddon>
              </InputGroup>

              <ButtonGroup mt={5} hidden={isOnRamp}>
                <Button
                  onClick={() => handleSetCurrencyAmount(25)}
                  variant="secondary"
                >
                  25%
                </Button>
                <Button
                  onClick={() => handleSetCurrencyAmount(50)}
                  variant="secondary"
                >
                  50%
                </Button>
                <Button
                  onClick={() => handleSetCurrencyAmount(75)}
                  variant="secondary"
                >
                  75%
                </Button>
                <Button
                  onClick={() => handleSetCurrencyAmount(100)}
                  variant="secondary"
                >
                  Sell Max
                </Button>
              </ButtonGroup>
              {errors.sourceAmount?.message && (
                <Text color="red.500" fontSize="xs" mt={1}>
                  {errors.sourceAmount?.message}
                </Text>
              )}
            </Stack>
          )}
        />
      </Stack>
    </CardRoot>
  );
};
