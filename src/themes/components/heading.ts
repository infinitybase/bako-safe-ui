import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const titleXl = defineStyle({
  fontSize: 'xl',
  fontWeight: 'bold',
  color: 'white',
});

const titleLg = defineStyle({
  fontSize: 'lg',
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

const dialogTitle = defineStyle({
  fontSize: '16px',
  lineHeight: '19.36px',
  fontWeight: 700,
  color: 'grey.50',
});

const dialogSectionTitle = defineStyle({
  fontWeight: 700,
  fontSize: '12px',
  lineHeight: '14.52px',
  color: 'grey.75',
});

const Heading = defineStyleConfig({
  variants: {
    'title-xl': titleXl,
    'title-lg': titleLg,
    'title-md': titleMd,
    'title-sm': titleSm,
    dialogTitle,
    dialogSectionTitle,
  },
});

export { Heading };
