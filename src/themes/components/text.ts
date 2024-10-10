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

const dialogDescription = defineStyle({
  fontSize: 'xs',
  color: 'grey.425',
  fontWeight: 400,
  lineHeight: '14.52px',
});

const Text = defineStyleConfig({
  variants: {
    description,
    subtitle,
    dialogDescription,
  },
});

export { Text };
