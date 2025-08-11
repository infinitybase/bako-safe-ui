import { CryptoCode, Currency, CurrencyConfig } from '@/components';

export const CRYPTO_CODES: CryptoCode[] = ['ETH_FUEL'];

export const CRYPTO_CONFIG: CurrencyConfig = {
  locale: 'en-US',
  decimalScale: 9,
  decimalSeparator: '.',
  thousandsSeparator: undefined,
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
    thousandsSeparator: '.',
    decimalSeparator: ',',
  },
  ETH_FUEL: CRYPTO_CONFIG,
};
