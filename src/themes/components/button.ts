import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const primary = defineStyle({
  bgColor: 'brand.500',
  color: 'dark.300',
  _hover: {
    _disabled: {
      bgColor: 'brand.500',
    },
  },
  fontSize: {
    base: 'sm',
    sm: 'md',
  },
});

const secondary = defineStyle({
  bgColor: 'initial',
  borderWidth: 1,
  borderColor: 'grey.500',
  color: 'grey.200',
  _hover: {
    _disabled: {
      bgColor: 'initial',
    },
  },
  fontSize: {
    base: 'sm',
    sm: 'md',
  },
});

const tertiary = defineStyle({
  bgColor: 'error.600',
  borderWidth: 1,
  color: 'error.500',
  _hover: {
    _disabled: {
      bgColor: 'initial',
    },
  },
  fontSize: {
    base: 'sm',
    sm: 'md',
  },
});

const icon = defineStyle({
  bgColor: 'grey.800',
  color: 'grey.200',
  fontSize: 'xl',
});

const baseStyle = defineStyle({
  borderRadius: 8,
  fontWeight: 'semibold',
});

const Button = defineStyleConfig({
  baseStyle,
  variants: {
    icon,
    primary,
    secondary,
    tertiary,
  },
});

export { Button };
