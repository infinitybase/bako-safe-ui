import { CryptoCode, Currency, CurrencyConfig } from '@/components';
import { valueWithoutCommas } from '@/modules/vault/utils';

export const CRYPTO_CODES: CryptoCode[] = ['ETH_FUEL'];

export const CRYPTO_CONFIG: CurrencyConfig = {
  locale: 'en-US',
  decimalScale: 9,
  decimalSeparator: '.',
  thousandsSeparator: ',',
};

export const CURRENCY_CONFIGS: Record<Currency, CurrencyConfig> = {
  BRL: {
    locale: 'pt-BR',
    decimalScale: 2,
    thousandsSeparator: '.',
    decimalSeparator: ',',
  },
  USD: {
    locale: 'en-US',
    decimalScale: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  EUR: {
    locale: 'de-DE',
    decimalScale: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  ETH_FUEL: CRYPTO_CONFIG,
  ETH: CRYPTO_CONFIG,
};

const getCurrencyByLocale = (locale: string): Currency => {
  switch (locale) {
    case 'pt-BR':
      return 'BRL';
    case 'en-US':
      return 'USD';
    case 'de-DE':
      return 'EUR';
    default:
      return 'USD';
  }
};

export const moneyFormat = (
  value: string | number,
  locale = 'en-US',
  options?: Intl.NumberFormatOptions,
) => {
  const formattedValue = parseFloat(
    valueWithoutCommas(value.toString(), locale),
  );
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: getCurrencyByLocale(locale),
    minimumFractionDigits: 2,
    ...options,
  }).format(formattedValue);
};
