import { Input, InputProps } from '@chakra-ui/react';
import MaskedInput from 'react-text-mask';
import { createNumberMask } from 'text-mask-addons';

// A máscara de número com separação de milhar e ponto decimal
const currencyMask = createNumberMask({
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ',', // Usando vírgula como separador de milhar
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 9, // Limita a 9 casas decimais
  integerLimit: 9, // Limita o número de dígitos inteiros
  allowNegative: false,
  allowLeadingZeroes: false,
});

interface AmountInputProps extends InputProps {
  isInvalid?: boolean;
}

const AmountInput = (props: AmountInputProps) => {
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;

    if (!inputValue.includes('.')) {
      inputValue = `${inputValue}.00`;
    }

    event.target.value = inputValue;

    props.onChange?.(event);
  };

  return (
    <MaskedInput
      mask={currencyMask}
      value={props.value}
      onChange={props.onChange}
      render={(maskedInputRef, maskedInputProps) => (
        <Input
          {...props}
          {...maskedInputProps}
          autoComplete="off"
          variant="dark"
          color="gray"
          step="any"
          ref={(input) => maskedInputRef(input as HTMLInputElement)}
          inputMode="decimal"
          borderColor={props.isInvalid ? 'error' : undefined}
          _focusVisible={{
            borderColor: props.isInvalid ? 'error' : undefined,
          }}
          _hover={{}}
          onBlur={handleBlur}
        />
      )}
    />
  );
};

export { AmountInput };
