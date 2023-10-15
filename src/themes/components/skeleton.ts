import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const baseStyle = defineStyle({
  speed: 1,
  startColor: 'dark.200',
  endColor: 'dark.500',
  w: '100%',
  borderRadius: 10,
});

const Skeleton = defineStyleConfig({
  baseStyle,
});

export { Skeleton };
