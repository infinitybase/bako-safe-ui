import { Input } from 'bako-ui';
import { forwardRef, useCallback, useMemo } from 'react';
import MaskedInput from 'react-text-mask';
import { createNumberMask } from 'text-mask-addons';

import { CRYPTO_CODES, CURRENCY_CONFIGS } from '@/utils';

import { CryptoCode, CurrencyConfig, CurrencyFieldProps } from './currency';

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

  if (includeLeadingZero && decimal) {
    decimal = decimal.padEnd(config.decimalScale, '0');
  }

  return decimal || value.endsWith(config.decimalSeparator)
    ? `${integer}${config.decimalSeparator}${decimal}`
    : integer;
};

const CurrencyStakeField = forwardRef<HTMLInputElement, CurrencyFieldProps>(
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

    const currencyMask = createNumberMask({
      prefix: '',
      suffix: '',
      includeThousandsSeparator: true,
      thousandsSeparatorSymbol: ',',
      allowDecimal: true,
      decimalSymbol: '.',
      decimalLimit: 9,
      allowNegative: false,
      allowLeadingZeroes: false,
    });

    const normalizedValue = useMemo(() => {
      if (!value) return '';
      value.replace(/,/g, '.');
      const allowedValue = value.replace(getAllowedPattern(), '');
      return formatValue(allowedValue, config, !isCrypto);
    }, [value, getAllowedPattern, config, isCrypto]);

    const handleInputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const nativeEvent = event.nativeEvent as InputEvent;
        const typed = nativeEvent.data;

        const allowedPattern = getAllowedPattern();

        if (typed === ',' || typed === '.') {
          if (typed === config.decimalSeparator) {
            if (inputValue.endsWith(config.decimalSeparator)) {
              const cleaned = inputValue.replace(allowedPattern, '');
              onChange?.(cleaned);
              return;
            }

            const cleaned = inputValue.replace(allowedPattern, '');
            onChange?.(cleaned);
            return;
          }

          const isComma = typed === ',';

          if (isComma && !inputValue.endsWith('.')) {
            const caretPosition = event.target.selectionStart ?? 0;

            const isFirstChar = inputValue.length === 0;
            const complement = isFirstChar ? '0.' : '.';

            const newValue = isFirstChar
              ? complement
              : inputValue.slice(0, caretPosition) +
                complement +
                inputValue.slice(caretPosition);

            event.target.value = newValue;

            const newCaretPosition = caretPosition + (isFirstChar ? 2 : 1);
            setTimeout(() => {
              event.target.setSelectionRange(
                newCaretPosition,
                newCaretPosition,
              );
            }, 0);

            const cleaned = inputValue.replace(allowedPattern, '');
            onChange?.(cleaned);
            return;
          }
        }

        const cleanedValue = inputValue.replace(allowedPattern, '');
        onChange?.(cleanedValue);
      },
      [config, getAllowedPattern, onChange],
    );

    const handleOnFocus = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const initialValues = ['0', '0.00', '0.000'];

        if (initialValues.includes(event.target.value)) {
          setTimeout(() => {
            onChange?.('');
          }, 0);
        }
      },
      [onChange],
    );

    return (
      <MaskedInput
        mask={currencyMask}
        value={normalizedValue}
        onChange={handleInputChange}
        onBlur={props.onBlur}
        onFocus={handleOnFocus}
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
            disabled={props.disabled}
          />
        )}
      />
    );
  },
);

CurrencyStakeField.displayName = 'CurrencyStakeField';

export { CurrencyStakeField };
