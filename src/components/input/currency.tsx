import { Input, InputProps } from '@chakra-ui/react';
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
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
  decimalScale?: number;
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
  (
    { value = '', currency, type, onChange, isInvalid, decimalScale, ...props },
    ref,
  ) => {
    const isCrypto = useMemo(() => type === 'crypto', [type]);
    const resolvedCurrency = type === 'crypto' ? null : currency;

    const config = useMemo(() => {
      const baseConfig = resolvedCurrency
        ? CURRENCY_CONFIGS[resolvedCurrency]
        : CRYPTO_CONFIG;

      return {
        ...baseConfig,
        decimalScale:
          decimalScale != null ? Number(decimalScale) : baseConfig.decimalScale,
      };
    }, [resolvedCurrency, decimalScale]);

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

    const currencyMask = useMemo(() => {
      return createNumberMask({
        prefix: '',
        suffix: '',
        includeThousandsSeparator: !!config.thousandsSeparator,
        thousandsSeparatorSymbol: config.thousandsSeparator,
        allowDecimal: true,
        decimalSymbol: config.decimalSeparator,
        decimalLimit: config.decimalScale,
        allowNegative: false,
        allowLeadingZeroes: false,
      });
    }, [config]);

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

    const handleBefoteInput = (e: React.InputEvent<HTMLInputElement>) => {
      if (e.data === ',') {
        e.preventDefault();

        const input = e.currentTarget;
        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;

        const newValue =
          input.value.slice(0, start) + '.' + input.value.slice(end);

        input.value = newValue;

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          'value',
        )?.set;
        nativeInputValueSetter?.call(input, newValue);

        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (normalizedValue === '0.') {
        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(
              normalizedValue.length,
              normalizedValue.length,
            );
          }
        });
      }
    }, [normalizedValue]);

    return (
      <MaskedInput
        key={config.decimalScale}
        mask={currencyMask}
        value={normalizedValue}
        onChange={handleInputChange}
        onFocus={handleOnFocus}
        onBlur={props.onBlur}
        render={(maskedInputRef, maskedInputProps) => (
          <Input
            {...props}
            {...maskedInputProps}
            onBeforeInput={handleBefoteInput}
            ref={(input) => {
              maskedInputRef(input as HTMLInputElement);
              inputRef.current = input as HTMLInputElement;
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
