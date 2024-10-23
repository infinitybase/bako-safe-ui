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

const Text = defineStyleConfig({
  variants: {
    description,
    subtitle,
  },
});

export { Text };
