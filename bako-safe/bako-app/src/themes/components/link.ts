import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const baseStyle = defineStyle({
  textDecoration: 'underline',
  fontWeight: 'semibold',
});

const Link = defineStyleConfig({
  baseStyle,
});

export { Link };
