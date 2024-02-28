import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const titleXl = defineStyle({
  fontSize: 'xl',
  fontWeight: 'bold',
  color: 'white',
});

const titleMd = defineStyle({
  fontSize: 'md',
  fontWeight: 'bold',
  color: 'white',
});

const titleSm = defineStyle({
  fontSize: 'sm',
  fontWeight: 'bold',
  color: 'white',
});

const Heading = defineStyleConfig({
  variants: {
    'title-xl': titleXl,
    'title-md': titleMd,
    'title-sm': titleSm,
  },
});

export { Heading };
