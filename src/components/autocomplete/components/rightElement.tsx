import { Box, BoxProps } from 'bako-ui';
import { memo, ReactNode } from 'react';

interface AutocompleteRightElementProps extends BoxProps {
  children?: ReactNode;
}

const AutocompleteRightElement = memo(
  ({ children, ...props }: AutocompleteRightElementProps) => {
    return (
      <Box
        pr={1}
        top="1px"
        right="1px"
        borderRadius={10}
        h="calc(100% - 3px)"
        w={16}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
        {...props}
      >
        {children}
      </Box>
    );
  },
);

AutocompleteRightElement.displayName = 'AutocompleteRightElement';

export default AutocompleteRightElement;
