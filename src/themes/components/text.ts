import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const description = defineStyle({
  fontSize: 'sm',
  color: 'grey.500',
});

const subtitle = defineStyle({
  fontSize: 'md',
  color: 'grey.425',
  fontWeight: 'semibold',
});

const dialogTitle = defineStyle({
  fontSize: '16px',
  lineHeight: '19.36px',
  fontWeight: 700,
  color: 'grey.50',
});

const Text = defineStyleConfig({
  variants: {
    description,
    subtitle,
    dialogTitle,
  },
});

export { Text };
