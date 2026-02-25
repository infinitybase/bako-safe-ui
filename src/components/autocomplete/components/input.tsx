import { Input, InputProps } from 'bako-ui';
import { forwardRef, memo } from 'react';

interface AutocompleteInputProps extends InputProps {}

const AutocompleteInput = memo(
  forwardRef<HTMLInputElement, AutocompleteInputProps>(
    function AutocompleteInput({ ...props }, ref) {
      return (
        <Input
          ref={ref}
          paddingInlineEnd={'2.2rem !important'}
          autoComplete="off"
          placeholder=" "
          variant="subtle"
          bg="gray.550"
          {...props}
        />
      );
    },
  ),
);

AutocompleteInput.displayName = 'AutocompleteInput';

export default AutocompleteInput;
