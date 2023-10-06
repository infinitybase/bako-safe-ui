import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const primary = defineStyle({
  bgColor: 'brand.500',
  color: 'dark.300',
  _hover: {
    _disabled: {
      bgColor: 'brand.500',
    },
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
});

const icon = defineStyle({
  bgColor: 'dark.100',
  color: 'grey.200',
  fontSize: 'xl',
});

const baseStyle = defineStyle({
  borderRadius: 8,
  fontWeight: 'semibold',
  fontSize: 'md',
});

const Button = defineStyleConfig({
  baseStyle,
  variants: {
    icon,
    primary,
    secondary,
  },
});

export { Button };
