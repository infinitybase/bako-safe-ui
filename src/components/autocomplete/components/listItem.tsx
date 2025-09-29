import { Box, BoxProps } from '@chakra-ui/react';
import { memo } from 'react';

interface AutocompleteOptionListItemProps extends Omit<BoxProps, 'onSelect'> {
  onSelect?: (value?: string) => void;
  value?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const AutocompleteOptionListItem = memo(
  ({
    onSelect,
    children,
    disabled,
    value,
    ...rest
  }: AutocompleteOptionListItemProps) => {
    return (
      <Box
        w="full"
        p={2}
        borderRadius={10}
        cursor="pointer"
        _hover={{ background: 'dark.150' }}
        opacity={disabled ? 0.5 : 1}
        onMouseDown={() => {
          if (!disabled) {
            onSelect?.(value);
          }
        }}
        {...rest}
      >
        {children}
      </Box>
    );
  },
);

AutocompleteOptionListItem.displayName = 'AutocompleteOptionListItem';

export default AutocompleteOptionListItem;
