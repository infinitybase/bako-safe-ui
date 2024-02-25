import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const glassmorphic = defineStyle({
  dialog: {
    bg: 'rgba(12, 12, 12, 0.8)',
    py: 9,
    px: 6,
  },
  overlay: {
    background: 'rgba(18, 18, 18, 0.10)',
    backdropFilter: 'blur(17px)',
  },
  header: {
    p: 0,
  },
  body: {
    p: 0,
  },
});

const Drawer = defineStyleConfig({
  defaultProps: {
    variant: 'glassmorphic',
  },
  variants: {
    glassmorphic,
  },
});

const Modal = defineStyleConfig({
  defaultProps: {
    variant: 'glassmorphic',
  },
  variants: {
    glassmorphic: {
      ...glassmorphic,
      dialog: {
        ...glassmorphic.dialog,
        bg: '#17181B',
      },
    },
  },
});

export { Drawer, Modal };
