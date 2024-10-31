import { Box, BoxProps } from '@chakra-ui/react';

interface SectionProps extends BoxProps {}

const Section = (props: SectionProps) => (
  <Box w="full" mb={7} {...props}>
    {props.children}
  </Box>
);

export { Section };
