import { InputRightElement, InputRightElementProps } from '@chakra-ui/react';
import { memo } from 'react';

interface AutocompleteRightElementProps extends InputRightElementProps {}

const AutocompleteRightElement = memo(
  ({ children, ...props }: AutocompleteRightElementProps) => {
    return (
      <InputRightElement
        pr={1}
        top="1px"
        right="1px"
        borderRadius={10}
        h="calc(100% - 3px)"
        w={16}
        {...props}
      >
        {children}
      </InputRightElement>
    );
  },
);

AutocompleteRightElement.displayName = 'AutocompleteRightElement';

export default AutocompleteRightElement;
