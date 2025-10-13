import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const success = defineStyle({
  bgColor: 'rgb(0, 244, 139, 0.10)',
  color: 'success.700',
  borderColor: 'rgb(0, 244, 139, 0.25)',
});

const error = defineStyle({
  bgColor: 'rgba(240, 93, 72, 0.1)',
  color: 'error.500',
  borderColor: 'rgba(240, 93, 72, 0.25)',
});

const warning = defineStyle({
  bgColor: 'warning.900',
  color: 'warning.500',
  borderColor: 'warning.900',
});

const darkWarning = defineStyle({
  bgColor: 'rgba(241, 101, 23, 0.1)',
  color: 'warning.650',
  borderColor: 'rgba(241, 101, 23, 0.25)',
});

const info = defineStyle({
  bgColor: 'rgba(18, 18, 18, 0.8)',
  color: 'grey.500',
  borderColor: 'rgba(73, 248, 174, 0.1)',
});

const blue = defineStyle({
  bgColor: 'transparent',
  color: 'blue.500',
  borderColor: 'blue.500Alpha26',
});

const yellow = defineStyle({
  bgColor: 'rgba(227, 175, 19, 0.1)',
  color: 'brand.500',
  borderColor: 'rgba(227, 175, 19, 0.25)',
});

const gray = defineStyle({
  bgColor: 'rgba(245,246,250,0.1)',
  color: '#F5F6FA',
  borderColor: 'rgba(245,246,250,0.1)',
});

const grey = defineStyle({
  bgColor: 'rgba(44,44,44,0.8)',
  color: 'grey.200',
  borderColor: 'rgba(73,248,174,0.1)',
});

const filled = defineStyle({
  bgColor: 'rgba(245, 245, 245, 0.05)',
  color: 'grey.425',
  borderColor: 'transparent',
  borderWidth: 0,
  fontSize: { base: 'xs', xs: 'sm' },
});

const baseStyle = defineStyle({
  fontSize: 'xs',
  fontWeight: 'normal',
  textTransform: 'initial',
  borderWidth: 1,
  padding: 1.5,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  borderRadius: 8,
  maxWidth: 'min-content',
});

const Badge = defineStyleConfig({
  baseStyle,
  variants: {
    error,
    success,
    warning,
    info,
    gray,
    blue,
    yellow,
    grey,
    darkWarning,
    filled,
  },
});

export { Badge };
