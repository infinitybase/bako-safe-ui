import { Input, InputProps } from "@chakra-ui/react";
import MaskedInput from "react-text-mask";
import { createNumberMask } from "text-mask-addons";

const currencyMask = createNumberMask({
  prefix: "",
  suffix: "",
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: "",
  allowDecimal: true,
  decimalSymbol: ".",
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
      const inputValue = event.target.value;
      const nativeEvent = event.nativeEvent as InputEvent;
      const isComma = nativeEvent.data === ",";

      // This if case just handle the comma (',') to replace it to a dot ('.')
      if (isComma && !inputValue.endsWith(".")) {
        const caretPosition = event.target.selectionStart ?? 0;

        // Determine if the comma is the first character
        const isFirstChar = inputValue.length === 0;
        const complement = isFirstChar ? "0." : ".";

        // Build the new value by appending or replacing the comma with a dot
        const newValue = isFirstChar
          ? complement
          : inputValue.slice(0, caretPosition) +
            complement +
            inputValue.slice(caretPosition);

        // Update the input value with the new value containing the dot
        event.target.value = newValue;

        // Adjust the "focus" position after the dot is inserted
        const newCaretPosition = caretPosition + (isFirstChar ? 2 : 1);
        event.target.setSelectionRange(newCaretPosition, newCaretPosition);

        props.onChange?.(event);
        return;
      }

      const isBackspace = inputValue.length < (props.value as string).length;

      if (
        inputValue.startsWith("0") &&
        inputValue.length === 1 &&
        isBackspace
      ) {
        event.target.value = ``;
      } else if (inputValue.startsWith("0") && inputValue.length === 1) {
        event.target.value = `0.`;
      }

      event.target.value = event.target.value.replace(/[^0-9.]/g, "");

      props.onChange?.(event);
    }}
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
        borderColor={props.isInvalid ? "error" : undefined}
        _focusVisible={{
          borderColor: props.isInvalid ? "error" : undefined,
        }}
        _hover={{}}
      />
    )}
  />
);

export { AmountInput };
