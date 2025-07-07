import { Input, InputProps } from '@chakra-ui/react';
import { forwardRef, useCallback, useMemo } from 'react';
import MaskedInput from 'react-text-mask';
import { createNumberMask } from 'text-mask-addons';

export type CurrencyCode = 'BRL' | 'USD' | 'EUR';
export type CryptoCode = 'ETH_FUEL';
const CRYPTO_CODES: CryptoCode[] = ['ETH_FUEL'];
export type Currency = CryptoCode | CurrencyCode;

interface CurrencyConfig {
  locale: string;
  decimalScale: number;
  thousandsSeparator: string | undefined;
  decimalSeparator: string;
}

const CRYPTO_CONFIG: CurrencyConfig = Object.freeze({
  locale: 'en-US',
  decimalScale: 9,
  decimalSeparator: '.',
  thousandsSeparator: undefined,
});

const CURRENCY_CONFIGS: Record<Currency, CurrencyConfig> = Object.freeze({
  BRL: Object.freeze({
    locale: 'pt-BR',
    decimalScale: 2,
    thousandsSeparator: '.',
    decimalSeparator: ',',
  }),
  USD: Object.freeze({
    locale: 'en-US',
    decimalScale: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  }),
  EUR: Object.freeze({
    locale: 'de-DE',
    decimalScale: 2,
    thousandsSeparator: '.',
    decimalSeparator: ',',
  }),
  ETH_FUEL: CRYPTO_CONFIG,
});

export interface CurrencyFieldProps
  extends Omit<InputProps, 'value' | 'onChange'> {
  value?: string;
  currency: Currency;
  onChange?: (value: string) => void;
  isInvalid?: boolean;
}

const CurrencyField = forwardRef<HTMLInputElement, CurrencyFieldProps>(
  ({ value = '', currency, onChange, isInvalid, ...props }, ref) => {
    const isCrypto = useMemo(
      () => CRYPTO_CODES.includes(currency as CryptoCode),
      [currency],
    );
    const config = useMemo(() => CURRENCY_CONFIGS[currency], [currency]);
    const regexCache = useMemo(() => {
      const decimalEscaped = config.decimalSeparator.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&',
      );
      const thousandsEscaped = config.thousandsSeparator?.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&',
      );

      return {
        crypto: new RegExp(`[^0-9\\${decimalEscaped}]`, 'g'),
        currency: new RegExp(
          `[^0-9\\${decimalEscaped}${thousandsEscaped ? `\\${thousandsEscaped}` : ''}]`,
          'g',
        ),
      };
    }, [config.decimalSeparator, config.thousandsSeparator]);

    const getAllowedPattern = useCallback(() => {
      return isCrypto ? regexCache.crypto : regexCache.currency;
    }, [regexCache, isCrypto]);

    const currencyMask = useMemo(
      () =>
        createNumberMask({
          prefix: '',
          suffix: '',
          includeThousandsSeparator: !isCrypto,
          thousandsSeparatorSymbol: config.thousandsSeparator,
          allowDecimal: true,
          decimalSymbol: config.decimalSeparator,
          decimalLimit: config.decimalScale,
          allowNegative: false,
          allowLeadingZeroes: false,
        }),
      [config, isCrypto],
    );

    const normalizedValue = useMemo(() => {
      if (!value) return '';

      const hasCorrectSeparator = value.includes(config.decimalSeparator);
      const hasWrongSeparator =
        config.decimalSeparator === ','
          ? value.includes('.')
          : value.includes(',');

      if (hasCorrectSeparator && !hasWrongSeparator) {
        return value;
      }

      return value;
    }, [value, config.decimalSeparator]);

    const handleInputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const allowedPattern = getAllowedPattern();
        const cleanedValue = inputValue.replace(allowedPattern, '');

        event.target.value = cleanedValue;
        onChange?.(cleanedValue);
      },
      [getAllowedPattern, onChange],
    );

    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        let inputValue = event.target.value;

        if (!inputValue) return;

        if (isCrypto) {
          props.onBlur?.(event);
          return;
        }

        if (!inputValue.includes(config.decimalSeparator)) {
          inputValue = `${inputValue}${config.decimalSeparator}${'0'.repeat(
            config.decimalScale,
          )}`;
        } else {
          const [integerPart, decimalPart] = inputValue.split(
            config.decimalSeparator,
          );
          const paddedDecimalPart = decimalPart.padEnd(
            config.decimalScale,
            '0',
          );
          inputValue = `${integerPart}${config.decimalSeparator}${paddedDecimalPart}`;
        }

        event.target.value = inputValue;
        props.onBlur?.(event);
        onChange?.(inputValue);
      },
      [config, props, isCrypto, onChange],
    );

    return (
      <MaskedInput
        mask={currencyMask}
        value={normalizedValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        render={(maskedInputRef, maskedInputProps) => (
          <Input
            {...props}
            {...maskedInputProps}
            ref={(input) => {
              maskedInputRef(input as HTMLInputElement);
              if (typeof ref === 'function') {
                ref(input);
              } else if (ref) {
                ref.current = input;
              }
            }}
            autoComplete="off"
            variant="filled"
            inputMode="decimal"
            borderColor={isInvalid ? 'error' : undefined}
            _focusVisible={{
              borderColor: isInvalid ? 'error' : undefined,
            }}
            _hover={{}}
          />
        )}
      />
    );
  },
);

CurrencyField.displayName = 'CurrencyField';

export { CurrencyField };
