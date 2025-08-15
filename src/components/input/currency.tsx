import { Input, InputProps } from '@chakra-ui/react';
import { forwardRef, memo, useCallback, useMemo } from 'react';
import MaskedInput from 'react-text-mask';
import { createNumberMask } from 'text-mask-addons';

import { CRYPTO_CONFIG, CURRENCY_CONFIGS, formatCurrencyValue } from '@/utils';

export type CurrencyCode = 'BRL' | 'USD' | 'EUR';
export type CryptoCode = 'ETH_FUEL' | 'ETH';

type CurrencyFieldType = 'fiat' | 'crypto';

type FiatFieldProps = {
  type: 'fiat';
  currency: CurrencyCode;
};

type CryptoFieldProps = {
  type: 'crypto';
  currency?: never;
};

type CommonFieldProps = Omit<InputProps, 'value' | 'onChange'> & {
  value?: string;
  onChange?: (value: string) => void;
  isInvalid?: boolean;
  disabled?: boolean;
  type: CurrencyFieldType;
};

export type CurrencyFieldProps = (FiatFieldProps | CryptoFieldProps) &
  CommonFieldProps;

export type Currency = CryptoCode | CurrencyCode;

export interface CurrencyConfig {
  locale: string;
  decimalScale: number;
  thousandsSeparator: string | undefined;
  decimalSeparator: string;
}

const Field = forwardRef<HTMLInputElement, CurrencyFieldProps>(
  ({ value = '', currency, type, onChange, isInvalid, ...props }, ref) => {
    const isCrypto = useMemo(() => type === 'crypto', [type]);
    const resolvedCurrency = type === 'crypto' ? null : currency;

    const config = useMemo(() => {
      if (!resolvedCurrency) {
        return CRYPTO_CONFIG;
      }
      return CURRENCY_CONFIGS[resolvedCurrency];
    }, [resolvedCurrency]);

    const regexCache = useMemo(() => {
      const decimalEscaped = config.decimalSeparator.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&',
      );
      const thousandsEscaped = config.thousandsSeparator?.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&',
      );
      const basePattern = `[^0-9\\${decimalEscaped}${
        thousandsEscaped ? `\\${thousandsEscaped}` : ''
      }]`;
      return {
        crypto: new RegExp(basePattern, 'g'),
        currency: new RegExp(basePattern, 'g'),
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
          includeThousandsSeparator: !!config.thousandsSeparator,
          thousandsSeparatorSymbol: config.thousandsSeparator,
          allowDecimal: true,
          decimalSymbol: config.decimalSeparator,
          decimalLimit: config.decimalScale,
          allowNegative: false,
          allowLeadingZeroes: false,
        }),
      [config],
    );

    const normalizedValue = useMemo(() => {
      if (!value) return '';

      const allowedValue = value.replace(getAllowedPattern(), '');
      return formatCurrencyValue(allowedValue, config, !isCrypto);
    }, [value, getAllowedPattern, config, isCrypto]);

    const handleInputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const allowedPattern = getAllowedPattern();
        const cleanedValue = inputValue.replace(allowedPattern, '');

        onChange?.(cleanedValue);
      },
      [getAllowedPattern, onChange],
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
        onFocus={handleOnFocus}
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

Field.displayName = 'CurrencyField';
const CurrencyField = memo(Field);

export { CurrencyField };
