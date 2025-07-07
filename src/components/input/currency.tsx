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

const CurrencyField = forwardRef<HTMLInputElement, CurrencyFieldProps>(
  ({ value = '', currency, onChange, isInvalid, ...props }, ref) => {
    const isCrypto = useMemo(
      () => CRYPTO_CODES.includes(currency as CryptoCode),
      [currency],
    );
    const config = useMemo(() => CURRENCY_CONFIGS[currency], [currency]);

    const getAllowedPattern = useCallback(() => {
      return isCrypto
        ? new RegExp(`[^0-9\\${config.decimalSeparator}]`, 'g')
        : new RegExp(
            `[^0-9\\${config.decimalSeparator}${config.thousandsSeparator ? `\\${config.thousandsSeparator}` : ''}]`,
            'g',
          );
    }, [config, isCrypto]);

    const cleanValue = useCallback((inputValue: string) => {
      return inputValue
        .replace(/[^0-9.,]/g, '')
        .replace(/[,.]/g, (_, offset, string) => {
          const lastSeparatorIndex = Math.max(
            string.lastIndexOf(','),
            string.lastIndexOf('.'),
          );
          return offset === lastSeparatorIndex ? '.' : '';
        });
    }, []);

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

      // Primeira validação: se está no formato correto, retorna sem alterar
      const hasCorrectSeparator = value.includes(config.decimalSeparator);
      const hasWrongSeparator =
        config.decimalSeparator === ','
          ? value.includes('.')
          : value.includes(',');

      if (hasCorrectSeparator && !hasWrongSeparator) {
        return value;
      }

      // Se tem separador errado, limpa e normaliza
      const cleanedValue = cleanValue(value);
      if (!cleanedValue) return value;

      const numericValue = parseFloat(cleanedValue);
      if (isNaN(numericValue) || numericValue <= 0) return value;

      const newValue = isCrypto
        ? numericValue.toString().replace('.', config.decimalSeparator)
        : numericValue
            .toFixed(config.decimalScale)
            .replace('.', config.decimalSeparator);

      // Notifica mudança se valor foi reformatado
      if (newValue !== value && onChange) {
        setTimeout(() => onChange(newValue), 0);
      }

      return newValue;
    }, [value, isCrypto, config, onChange, cleanValue]);

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
        event.target.value = cleanedValue;

        onChange?.(cleanedValue);
      },
      [config, onChange, getAllowedPattern],
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
      },
      [config, props, isCrypto],
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
