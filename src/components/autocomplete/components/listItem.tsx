import { Box, BoxProps } from 'bako-ui';
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
        px={2}
        py={1.5}
        borderRadius="sm"
        cursor="pointer"
        _hover={{ background: 'bg.emphasized/60' }}
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
