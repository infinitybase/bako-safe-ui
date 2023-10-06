import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const baseStyle = defineStyle({
  field: {
    bg: `dark.200`,
    color: 'grey.200',
    fontSize: 'md',
    borderColor: `dark.100`,
    borderWidth: 1,
    pt: 4,
    pb: 1,
    px: 5,
    height: 'auto',
    borderRadius: 10,
    _hover: {
      borderColor: `dark.100`,
    },
    _focusVisible: {
      borderColor: `grey.200`,
      bg: `dark.300`,
      boxShadow:
        // '0 0 0 3px color-mix(in srgb, var(--chakra-colors-brand-500)) 70%, transparent)',
        '0 0 0 3px color-mix(in srgb, var(--chakra-colors-brand-500) 50%, transparent)',
    },
    _placeholder: {
      color: 'grey.500',
      fontWeight: 'medium',
    },
  },
  addon: {},
  element: {},
});

const Input = defineStyleConfig({
  baseStyle,
  defaultProps: {
    colorScheme: 'dark',
  },
  variants: {
    custom: baseStyle,
  },
});

export { Input, baseStyle as inputStyle };
