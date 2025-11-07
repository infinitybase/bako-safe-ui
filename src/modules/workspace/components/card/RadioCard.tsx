import { Box, BoxProps } from 'bako-ui';

const RadioCard = ({ children, ...props }: BoxProps) => {
  return (
    <Box borderRadius="lg" {...props}>
      {children}
    </Box>
  );
};

export { RadioCard };
