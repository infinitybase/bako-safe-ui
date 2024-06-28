import { Input, InputProps } from '@chakra-ui/react';
import MaskedInput from 'react-text-mask';
import { createNumberMask } from 'text-mask-addons';

const currencyMask = createNumberMask({
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: '',
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 9, // how many digits allowed after the decimal
  integerLimit: 9, // limit length of integer numbers
  allowNegative: false,
  allowLeadingZeroes: false,
});

interface AmountInputProps extends InputProps {
  isInvalid?: boolean;
}

const AmountInput = (props: AmountInputProps) => (
  <MaskedInput
    mask={currencyMask}
    value={props.value}
    onChange={(event) => {
      const value = event.target.value;
      const isBackspace = value.length < (props.value as string).length;

      if (value.startsWith('0') && value.length === 1 && isBackspace) {
        event.target.value = ``;
      } else if (value.startsWith('0') && value.length === 1) {
        event.target.value = `0.`;
      }

      event.target.value = event.target.value.replace(/[^0-9.]/g, '');
      props.onChange?.(event);
    }}
    render={(maskedInputRef, maskedInputProps) => (
      <Input
        {...props}
        {...maskedInputProps}
        autoComplete="off"
        variant="filled"
        bg="dark.100"
        color="gray"
        step="any"
        ref={(input) => maskedInputRef(input as HTMLInputElement)}
        inputMode="decimal"
        borderColor={props.isInvalid ? 'error' : undefined}
        _focusVisible={{
          borderColor: props.isInvalid ? 'error' : undefined,
        }}
        _hover={{}}
      />
    )}
  />
);

export { AmountInput };
