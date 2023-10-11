import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const baseStyle = defineStyle({
  excessLabel: {
    width: '30px',
    height: '30px',
    bgColor: 'brand.500',
    borderWidth: 2,
    borderColor: 'dark.100',
    color: 'dark.900',
    fontWeight: 'bold',
    fontSize: 'sm',
    marginLeft: -2,
    letterSpacing: -1,
  },

  group: {
    '.chakra-avatar': {
      borderColor: 'dark.100',
      borderWidth: 2,
      width: '30px',
      height: '30px',
    },
  },
});

const roundedSquare = defineStyle({
  container: {
    borderRadius: 8,
    fontSize: 'sm',
  },
  excessLabel: {
    borderRadius: 8,
    width: '34px',
    height: '34px',
    fontSize: 'sm',
  },
  badge: {
    borderRadius: 8,
    fontSize: 'sm',
  },
  group: {
    '.chakra-avatar': {
      borderColor: 'dark.100',
      borderWidth: 2,
      fontSize: 'sm',
      width: '34px',
      height: '34px',
      img: {
        borderRadius: 5,
      },
    },
  },
});

const Avatar = defineStyleConfig({
  baseStyle,
  variants: {
    roundedSquare,
  },
});

export { Avatar };
