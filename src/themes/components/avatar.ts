import { avatarAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(avatarAnatomy.keys);

const baseStyle = definePartsStyle({
  container: {
    borderRadius: 8,
    img: {
      borderRadius: 8,
    },
  },
  excessLabel: {
    borderRadius: 8,
    width: '40px',
    height: '40px',
    bgColor: 'dark.200',
    borderWidth: 2,
    borderColor: 'dark.100',
  },
  badge: {
    borderRadius: 8,
  },
  group: {
    '.chakra-avatar': {
      borderColor: 'brand.600',
      borderWidth: 2,
      width: '40px',
      height: '40px',
      img: {
        borderRadius: 5,
      },
    },
  },
});

const xxl = defineStyle({
  width: 20,
  height: 20,
  fontSize: 'md',
});

const sizes = {
  xxl: definePartsStyle({ container: xxl }),
};

const Avatar = defineMultiStyleConfig({ baseStyle, sizes });

export { Avatar };
