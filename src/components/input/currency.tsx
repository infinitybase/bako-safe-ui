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

const CRYPTO_CONFIG: CurrencyConfig = {
  locale: 'en-US',
  decimalScale: 9,
  decimalSeparator: '.',
  thousandsSeparator: undefined,
};

const CURRENCY_CONFIGS: Record<Currency, CurrencyConfig> = {
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

export interface CurrencyFieldProps
  extends Omit<InputProps, 'value' | 'onChange'> {
  value?: string;
  currency: Currency;
  onChange?: (value: string) => void;
  isInvalid?: boolean;
}

const formatValue = (
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

  return `${integer}${config.decimalSeparator}${decimal}`;
};

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

      const allowedValue = value.replace(getAllowedPattern(), '');
      return formatValue(allowedValue, config, !isCrypto);
    }, [value, getAllowedPattern, config, isCrypto]);

    const handleInputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const nativeEvent = event.nativeEvent as InputEvent;

        const isDecimalInput =
          nativeEvent.data === ',' || nativeEvent.data === '.';

        if (isDecimalInput) {
          if (config.decimalSeparator === ',' && nativeEvent.data === '.') {
            event.preventDefault();
            return;
          }

          if (config.decimalSeparator === '.' && nativeEvent.data === ',') {
            event.preventDefault();
            return;
          }

          if (inputValue.endsWith(config.decimalSeparator)) {
            return;
          }

          const caretPosition = event.target.selectionStart ?? 0;

          const isEmpty = inputValue.length === 0;

          let newValue;
          if (isEmpty) {
            newValue = `0${config.decimalSeparator}`;
          } else {
            const beforeCaret = inputValue.slice(0, caretPosition - 1);
            const afterCaret = inputValue.slice(caretPosition);
            newValue = beforeCaret + config.decimalSeparator + afterCaret;
          }

          const allowedPattern = getAllowedPattern();

          const cleanedNewValue = newValue.replace(allowedPattern, '');
          event.target.value = cleanedNewValue;

          setTimeout(() => {
            const newCaretPosition = caretPosition + (isEmpty ? 1 : 0);
            event.target.setSelectionRange(newCaretPosition, newCaretPosition);
          }, 0);

          onChange?.(cleanedNewValue);
          return;
        }

        const allowedPattern = getAllowedPattern();

        const cleanedValue = inputValue.replace(allowedPattern, '');
        //event.target.value = cleanedValue;

        onChange?.(cleanedValue);
      },
      [config, onChange, getAllowedPattern],
    );

    return (
      <MaskedInput
        mask={currencyMask}
        value={normalizedValue}
        onChange={handleInputChange}
        onBlur={props.onBlur}
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
