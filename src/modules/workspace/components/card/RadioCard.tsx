import { Box, BoxProps } from '@chakra-ui/react';

const RadioCard = ({ children, ...props }: BoxProps) => {
  return (
    <Box borderRadius="lg" {...props}>
      {children}
    </Box>
  );
};

export { RadioCard };
