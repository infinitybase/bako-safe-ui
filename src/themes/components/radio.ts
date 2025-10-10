import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const baseStyle = defineStyle({
  control: {
    bg: 'transparent',
    borderColor: 'grey.500',
    _checked: {
      bg: 'brand.500',
      _before: {
        display: 'none',
      },
    },
    _hover: {
      bg: 'brand.500',
    },
  },
  label: {
    color: 'grey.500',
    _checked: {
      color: 'white',
      fontWeight: 'bold',
    },
  },
});

const Radio = defineStyleConfig({
  baseStyle,
  defaultProps: {
    colorPalette: 'dark',
  },
  variants: {
    custom: baseStyle,
  },
});

export { Radio };
