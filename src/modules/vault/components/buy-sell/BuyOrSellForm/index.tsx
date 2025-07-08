import { Button, Stack } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useDebounce } from '@/modules/core/hooks';
import {
  ICreateWidgetPayload,
  IPurchaseLimitsResponse,
} from '@/modules/core/models/meld';
import { useListCryptoQuote } from '@/modules/vault/hooks';
import { parseToNumber } from '@/modules/vault/utils';

import { QuoteError } from '../QuoteError';
import { SelectPaymentMethod } from '../SelectPaymentMethod';
import { SelectQuote } from '../SelectQuote';
import { DestinationCurrency } from './DestinationCurrency';
import { SourceCurrency } from './SourceCurrency';

const getDefaultCurrencyCode = (country: string) => {
  switch (country) {
    case 'BR':
      return 'BRL';
    case 'US':
      return 'USD';
    default:
      return 'EUR';
  }
};

export const BuyOrSellForm = ({
  onSubmit,
  vaultAddress,
  purchaseLimits,
  isSubmitting = false,
  type,
}: {
  onSubmit: (data: ICreateWidgetPayload) => void;
  vaultAddress: string;
  purchaseLimits?: IPurchaseLimitsResponse[];
  isSubmitting?: boolean;
  type: 'BUY' | 'SELL';
}) => {
  const defaultCountry = window.navigator.language.split('-')[1] || 'US';
  const currencyCodeByCountry = getDefaultCurrencyCode(defaultCountry);
  const limitByCountry = purchaseLimits?.find((limit) =>
    type === 'BUY'
      ? limit.currencyCode === currencyCodeByCountry
      : limit.currencyCode === 'ETH_FUEL',
  );
  const methods = useForm<ICreateWidgetPayload>({
    defaultValues: {
      type,
      countryCode: defaultCountry,
      sourceCurrencyCode: type === 'BUY' ? currencyCodeByCountry : 'ETH_FUEL',
      destinationCurrencyCode:
        type === 'BUY' ? 'ETH_FUEL' : currencyCodeByCountry,
      paymentMethodType: 'CREDIT_DEBIT_CARD',
      walletAddress: vaultAddress,
      sourceAmount: limitByCountry?.defaultAmount.toString(),
    },
    mode: 'onBlur',
  });
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isValid },
  } = methods;
  const destinationCurrencyCode = watch('destinationCurrencyCode');
  const sourceCurrencyCode = watch('sourceCurrencyCode');
  const paymentMethodType = watch('paymentMethodType');
  const walletAddress = watch('walletAddress');
  const countryCode = watch('countryCode');
  const sourceAmount = watch('sourceAmount');
  const provider = watch('serviceProvider');
  const debouncedAmount = useDebounce(parseToNumber(sourceAmount || '0'), 600);

  const {
    quotes,
    isLoading: isLoadingQuotes,
    error: errorQuote,
  } = useListCryptoQuote({
    params: {
      sourceCurrencyCode,
      destinationCurrencyCode,
      countryCode,
      paymentMethodType,
      walletAddress,
      sourceAmount: debouncedAmount,
    },
    enabled:
      !!sourceCurrencyCode &&
      !!destinationCurrencyCode &&
      !!countryCode &&
      !!paymentMethodType &&
      !!walletAddress &&
      debouncedAmount > 0 &&
      isValid,
    retry: false,
  });

  const bestQuote = useMemo(
    () =>
      quotes?.quotes?.reduce((prev, current) =>
        prev.destinationAmount > current.destinationAmount ? prev : current,
      ),
    [quotes?.quotes],
  );

  useEffect(() => {
    if (bestQuote && !provider) {
      setValue('serviceProvider', bestQuote.serviceProvider);
    }
  }, [bestQuote, provider, setValue]);

  const quoteDestinationAmount = quotes?.quotes?.find(
    (quote) => quote.serviceProvider === provider,
  )?.destinationAmount;

  const limits = useMemo(
    () =>
      purchaseLimits?.find(
        (limit) => limit.currencyCode === sourceCurrencyCode,
      ),
    [purchaseLimits, sourceCurrencyCode],
  );

  const isOnRamp = useMemo(() => type === 'BUY', [type]);

  return (
    <FormProvider {...methods}>
      <Stack as="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
        <SourceCurrency
          maxAmount={limits?.maximumAmount}
          minAmount={limits?.minimumAmount}
          isOnRamp={isOnRamp}
        />
        <DestinationCurrency
          quoteDestinationAmount={quoteDestinationAmount}
          isLoadingQuotes={isLoadingQuotes}
          isOnRamp={isOnRamp}
        />
        {quotes?.quotes && quotes?.quotes?.length > 0 && (
          <SelectQuote
            quotes={quotes?.quotes}
            bestProviderQuote={bestQuote?.serviceProvider}
          />
        )}
        {errorQuote && <QuoteError />}
        <SelectPaymentMethod />
        <Button
          isDisabled={!!errorQuote || !provider}
          type="submit"
          variant="primary"
          mt={3}
          isLoading={isSubmitting}
        >
          {type === 'BUY' ? 'Buy' : 'Sell'}
          {' token'}
        </Button>
      </Stack>
    </FormProvider>
  );
};
