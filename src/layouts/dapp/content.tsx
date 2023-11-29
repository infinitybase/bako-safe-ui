import { Box, BoxProps } from '@chakra-ui/react';

interface ContentProps extends BoxProps {}

const Content = (props: ContentProps) => (
  <Box w="full" px={6} py={8}>
    {props.children}
  </Box>
);

export { Content };
