import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const inputActiveStyle = {
  borderColor: `grey.200`,
  color: 'white',
  boxShadow:
    // '0 0 0 3px color-mix(in srgb, var(--chakra-colors-brand-500)) 70%, transparent)',
    '0 0 0 1px color-mix(in srgb, var(--chakra-colors-brand-500) 100%, transparent)',
  '~ .chakra-input__right-element': {
    background: 'grey.825',
  },
};

const inputInvalidStyle = {
  borderColor: `error.500`,
  bg: `grey.825`,
  boxShadow: 'error.600',
  '~ .chakra-input__right-element': {
    background: 'grey.825',
  },
};

const baseStyle = defineStyle({
  field: {
    color: 'grey.200',
    fontSize: 'md',
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

const defaultStyle = defineStyle({
  ...baseStyle,
  field: {
    ...baseStyle.field,
    bg: `dark.250`,
    borderColor: `grey.600`,
  },
});

const darkStyle = defineStyle({
  ...baseStyle,
  field: {
    ...baseStyle.field,
    bg: `grey.825`,
    borderColor: `grey.800`,
  },
});

const filled = defineStyle({
  ...baseStyle,
  field: {
    ...baseStyle.field,
    background: 'transparent',
    borderColor: `grey.950`,
    color: 'section.200',
    minW: 0,
    lineHeight: 'normal',
    border: 'none',
    borderWidth: 0,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderRadius: 0,
    _hover: {
      background: 'transparent',
      borderColor: `grey.200`,
    },
    _focus: {
      boxShadow: 'none',
      borderColor: `grey.200`,
    },
    _focusVisible: {
      boxShadow: 'none',
      borderColor: `grey.200`,
    },
  },
});

const Input = defineStyleConfig({
  baseStyle,
  defaultProps: {
    variant: 'default',
    colorPalette: 'grey',
  },
  variants: {
    default: defaultStyle,
    dark: darkStyle,
    filled,
  },
});

const Textarea = Input;

export { Input, baseStyle as inputStyle, Textarea };
