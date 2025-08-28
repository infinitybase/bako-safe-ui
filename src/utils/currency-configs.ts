import { CryptoCode, Currency, CurrencyConfig } from '@/components';

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
    thousandsSeparator: '.',
    decimalSeparator: ',',
  },
  ETH_FUEL: CRYPTO_CONFIG,
  ETH: CRYPTO_CONFIG,
};

export const formatCurrencyValue = (
  value: string,
  config: CurrencyConfig,
  includeLeadingZero: boolean,
) => {
  const [integerPart, decimalPart] = value.split(config.decimalSeparator);
  let decimal = decimalPart || '';
  let integer = integerPart || '';

  if (config.thousandsSeparator) {
    integer = integer.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      config.thousandsSeparator,
    );
  }

  if (includeLeadingZero) {
    decimal = decimal.padEnd(config.decimalScale, '0');
  }

  if (!includeLeadingZero) {
    const endsWithDecimal = value.endsWith(config.decimalSeparator);
    if (decimal.length === 0) {
      if (endsWithDecimal) {
        return `${integer}${config.decimalSeparator}`;
      }
      return integer; // no decimal typed
    }
    return `${integer}${config.decimalSeparator}${decimal}`;
  }

  return `${integer}${config.decimalSeparator}${decimal}`;
};
