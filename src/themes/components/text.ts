import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const description = defineStyle({
  fontSize: 'sm',
  color: 'grey.500',
});

const subTitle = defineStyle({
  fontSize: 'md',
  color: 'grey.200',
  fontWeight: 'semibold',
});

const Text = defineStyleConfig({
  variants: {
    description,
    subTitle,
  },
});

export { Text };
