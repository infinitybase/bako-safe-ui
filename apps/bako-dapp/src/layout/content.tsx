import { Box, BoxProps } from '@chakra-ui/react';

interface ContentProps extends BoxProps {}

const Content = ({ children, ...rest }: ContentProps) => (
  <Box w="full" px={6} py={8} {...rest}>
    {children}
  </Box>
);

export { Content };
