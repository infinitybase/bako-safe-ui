import { Box, BoxProps } from '@chakra-ui/react';

export interface CardProps extends Omit<BoxProps, 'variant'> {
  variant?: keyof typeof variants;
}

const variants = {
  'green-gradient': {
    _before: {
      content: '""',
      position: 'absolute',
      inset: 0,
      border: '1px solid transparent',
      background:
        'linear-gradient(180deg, rgba(0, 244, 139, 1), rgba(0, 244, 139, 0.5)) border-box',
      mask: 'linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)',
      maskComposite: 'exclude',
      borderRadius: '10px',
      pointerEvents: 'none',
    },
  },
  default: {},
} as const;

const Card = (props: CardProps) => {
  const { children, variant, ...rest } = props;

  const variantStyle = variants[variant || 'default'];

  return (
    <Box
      borderWidth={1}
      borderColor="dark.100"
      bg="dark.300"
      borderRadius={10}
      padding={6}
      sx={variantStyle}
      {...rest}
    >
      {children}
    </Box>
  );
};

export { Card };
