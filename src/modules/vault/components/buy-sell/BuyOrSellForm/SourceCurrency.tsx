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
import { parseToNumber, removeRightZeroes } from '@/modules/vault/utils';
import { useVaultInfosContext } from '@/modules/vault/VaultInfosProvider';
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
    setFocus,
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
    () => bn(fuelEthAsset?.amount ?? 0).formatUnits(9),
    [fuelEthAsset],
  );

  const handleSetCurrencyAmount = (percentage: number) => {
    const amount = parseToNumber(ethAmount) * (percentage / 100);
    setValue('sourceAmount', amount.toString());
    setFocus('sourceAmount');
  };

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
              Balance: {removeRightZeroes(ethAmount)} ETH
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
              positive: (value) =>
                parseToNumber(value) > 0 ||
                'Source amount must be greater than 0',
              min: (value) => {
                if (minAmount && parseToNumber(value) < minAmount) {
                  return `Source amount must be greater than ${minAmount}`;
                }
                return true;
              },
              max: (value) => {
                if (maxAmount && parseToNumber(value) > maxAmount) {
                  return `Source amount must be less than ${Intl.NumberFormat(
                    currentCurrency?.currencyCode,
                    {
                      style: 'currency',
                      currency: currentCurrency?.currencyCode,
                    },
                  ).format(maxAmount)}`;
                }
                if (
                  !isOnRamp &&
                  bn.parseUnits(ethAmount).lt(bn.parseUnits(value))
                ) {
                  return `You don't have enough ETH to sell`;
                }
                return true;
              },
            },
          }}
          defaultValue="0"
          render={({ field }) => (
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
                minW="150px"
                w="fit-content"
              >
                <CurrencyField
                  currency={currentCurrencyCode as CurrencyCode}
                  isInvalid={!!errors.sourceAmount}
                  textAlign="center"
                  borderBottomWidth="0"
                  minW={0}
                  px={0}
                  fontSize="3xl"
                  {...field}
                  ref={mergeRefs(field.ref, inputRef)}
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                />
                <InputMirror inputRef={inputRef} value={field.value} />
                <InputRightAddon alignSelf="end" color="section.200">
                  {currentCurrency?.currencyCode === 'ETH_FUEL'
                    ? 'ETH'
                    : currentCurrency?.currencyCode}
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
