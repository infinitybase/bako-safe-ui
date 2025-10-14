import { Button, Stack } from 'bako-ui';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { getChainId } from '@/modules/core';
import { useDebounce } from '@/modules/core/hooks';
import {
  ICreateWidgetPayload,
  IPurchaseLimitsResponse,
} from '@/modules/core/models/meld';
import { useListCryptoQuote } from '@/modules/vault/hooks';
import { valueWithoutCommas } from '@/modules/vault/utils';

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
      : limit.currencyCode === 'ETH',
  );
  const destinationCurrency = getChainId() === 0 ? 'ETH' : 'ETH_FUEL';
  const methods = useForm<ICreateWidgetPayload>({
    defaultValues: {
      type,
      countryCode: defaultCountry,
      sourceCurrencyCode:
        type === 'BUY' ? currencyCodeByCountry : destinationCurrency,
      destinationCurrencyCode:
        type === 'BUY' ? destinationCurrency : currencyCodeByCountry,
      paymentMethodType: 'CREDIT_DEBIT_CARD',
      walletAddress: vaultAddress,
      sourceAmount: limitByCountry?.defaultAmount.toString(),
    },
    mode: 'onBlur',
  });
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid },
  } = methods;
  const {
    destinationCurrencyCode,
    sourceCurrencyCode,
    countryCode,
    sourceAmount,
    serviceProvider: provider,
    walletAddress,
    paymentMethodType,
  } = useWatch({ control });
  const locale = useMemo(() => {
    if (sourceCurrencyCode === 'BRL') return 'pt-BR';
    return 'en-US';
  }, [sourceCurrencyCode]);
  const debouncedAmount = useDebounce(
    Number(valueWithoutCommas(sourceAmount || '0', locale)),
    600,
  );

  const {
    quotes,
    isLoading: isLoadingQuotes,
    error: errorQuote,
  } = useListCryptoQuote({
    params: {
      sourceCurrencyCode: sourceCurrencyCode!,
      destinationCurrencyCode: destinationCurrencyCode!,
      countryCode: countryCode!,
      paymentMethodType: paymentMethodType!,
      walletAddress: walletAddress!,
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

  const destinationAmount = useMemo(
    () =>
      quotes?.quotes?.find((quote) => quote.serviceProvider === provider)
        ?.destinationAmount,
    [quotes?.quotes, provider],
  );

  const limits = useMemo(
    () =>
      purchaseLimits?.find(
        (limit) => limit.currencyCode === sourceCurrencyCode,
      ),
    [purchaseLimits, sourceCurrencyCode],
  );

  const isOnRamp = useMemo(() => type === 'BUY', [type]);

  const beforeSubmit = (data: ICreateWidgetPayload) => {
    const payload: ICreateWidgetPayload = {
      ...data,
      destinationAmount: quotes?.quotes
        ?.find((quote) => quote.serviceProvider === data.serviceProvider)
        ?.destinationAmount?.toString(),
    };
    onSubmit(payload);
  };

  return (
    <FormProvider {...methods}>
      <Stack as="form" onSubmit={handleSubmit(beforeSubmit)} gap={2}>
        <SourceCurrency
          maxAmount={limits?.maximumAmount}
          minAmount={limits?.minimumAmount}
          isOnRamp={isOnRamp}
        />
        <DestinationCurrency
          destinationAmount={destinationAmount}
          isLoadingQuotes={isLoadingQuotes}
          isOnRamp={isOnRamp}
        />
        <SelectQuote
          quotes={quotes?.quotes || []}
          bestProviderQuote={bestQuote?.serviceProvider}
          isLoadingQuotes={isLoadingQuotes}
        />
        {errorQuote && <QuoteError />}
        <SelectPaymentMethod />
        <Button
          disabled={!!errorQuote || !provider}
          type="submit"
          colorPalette="primary"
          mt={3}
          loading={isSubmitting}
        >
          {type === 'BUY' ? 'Buy' : 'Sell'}
          {' token'}
        </Button>
      </Stack>
    </FormProvider>
  );
};
