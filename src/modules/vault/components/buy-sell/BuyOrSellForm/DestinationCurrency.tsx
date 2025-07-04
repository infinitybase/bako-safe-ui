import {
  Flex,
  Input,
  InputGroup,
  InputRightAddon,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { SelectedCurrency } from '@/modules/core/components';
import { ICreateWidgetPayload } from '@/modules/core/models/meld';
import {
  useListCryptoCurrencies,
  useListFiatCurrencies,
} from '@/modules/vault/hooks';

import { CardRoot } from '../CardRoot';
import { CurrencyOptionsModal } from '../CurrencyOptionsModal';

export const DestinationCurrency = ({
  quoteDestinationAmount,
  isLoadingQuotes = false,
  isOnRamp,
}: {
  quoteDestinationAmount?: number;
  isLoadingQuotes?: boolean;
  isOnRamp: boolean;
}) => {
  const { cryptoCurrencies, isLoading: isLoadingCurrencies } =
    useListCryptoCurrencies();
  const { fiatCurrencies, isLoading: isLoadingFiatCurrencies } =
    useListFiatCurrencies();
  const { control, watch, setValue } = useFormContext<ICreateWidgetPayload>();
  const currencyModal = useDisclosure();

  const currentCurrencyCode = watch('destinationCurrencyCode');

  const handleCurrencyChange = (currencyCode: string) => {
    setValue('destinationCurrencyCode', currencyCode);
    currencyModal.onClose();
  };

  const currencyOptions = isOnRamp ? cryptoCurrencies : fiatCurrencies;

  const currentCurrency = useMemo(
    () =>
      currencyOptions.find(
        (currency) => currency.currencyCode === currentCurrencyCode,
      ),
    [currencyOptions, currentCurrencyCode],
  );

  const options = useMemo(
    () =>
      currencyOptions.map((currency) => ({
        label: currency.name,
        value: currency.currencyCode,
        imageUrl: currency.symbolImageUrl,
      })),
    [currencyOptions],
  );

  const isLoading = isLoadingCurrencies || isLoadingFiatCurrencies;

  return (
    <CardRoot>
      <Flex justifyContent="space-between" alignItems="flex-start">
        <Flex gap={4} alignItems="center">
          <Text color="section.500" fontSize="sm">
            You receive
          </Text>
          {isLoadingQuotes && <Spinner size="xs" color="grey.200" />}
        </Flex>

        <Flex gap={2} alignItems="center">
          <Controller
            control={control}
            name="destinationCurrencyCode"
            defaultValue="ETH"
            render={() => (
              <SelectedCurrency
                onClick={currencyModal.onOpen}
                imageUrl={currentCurrency?.symbolImageUrl}
                name={currentCurrency?.name}
                isLoadingCurrencies={isLoading}
              />
            )}
          />
          <CurrencyOptionsModal
            open={currencyModal.isOpen}
            onClose={currencyModal.onClose}
            onCurrencyChange={handleCurrencyChange}
            currentCurrencyCode={currentCurrencyCode}
            currencies={options}
            isLoading={isLoading}
          />
        </Flex>
      </Flex>

      <Stack justifyContent="center" alignItems="center" w="full">
        <Stack w="fit-content" alignItems="center" pb={16} pt={5}>
          <InputGroup
            alignItems="center"
            justifyContent="center"
            borderBottom="1px solid"
            borderColor="grey.950"
            _hover={{
              borderColor: 'grey.200',
            }}
            px={0}
            w="fit-content"
          >
            <Input
              name="destinationAmount"
              textAlign="center"
              borderBottomWidth="0"
              minW={0}
              px={0}
              variant="filled"
              fontSize="3xl"
              value={quoteDestinationAmount}
              disabled
              // disabled={!quoteDestinationAmount}
            />
            <InputRightAddon alignSelf="end" color="section.200">
              {currentCurrency?.currencyCode === 'ETH_FUEL'
                ? 'ETH'
                : currentCurrency?.currencyCode}
            </InputRightAddon>
          </InputGroup>
        </Stack>
      </Stack>
    </CardRoot>
  );
};
