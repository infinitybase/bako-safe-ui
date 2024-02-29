import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const inputActiveStyle = {
  borderColor: `grey.200`,
  color: 'white',
  bg: `dark.250`,
  boxShadow:
    // '0 0 0 3px color-mix(in srgb, var(--chakra-colors-brand-500)) 70%, transparent)',
    '0 0 0 1px color-mix(in srgb, var(--chakra-colors-brand-500) 100%, transparent)',
  '~ .chakra-input__right-element': {
    background: 'dark.250',
  },
};

const inputInvalidStyle = {
  borderColor: `error.500`,
  bg: `dark.250`,
  boxShadow: 'error.600',
  '~ .chakra-input__right-element': {
    background: 'dark.250',
  },
};

const baseStyle = defineStyle({
  field: {
    bg: `dark.250`,
    color: 'grey.200',
    fontSize: 'md',
    borderColor: `grey.600`,
    boxShadow: 'none',
    borderWidth: 1,
    pt: 5,
    pb: 1,
    px: 5,
    height: 'auto',
    borderRadius: 10,
    _hover: {
      borderColor: `dark.100`,
    },
    _blur: {
      background: 'dark.250',
    },
    _invalid: inputInvalidStyle,
    _focus: inputActiveStyle,
    _focusVisible: inputActiveStyle,
    _placeholder: {
      color: 'grey.200',
      fontWeight: 'medium',
    },
  },
  addon: {},
  element: {},
});

const Input = defineStyleConfig({
  baseStyle,
  defaultProps: {
    colorScheme: 'grey',
  },
  variants: {
    custom: baseStyle,
  },
});

const Textarea = Input;

export { Input, baseStyle as inputStyle, Textarea };
