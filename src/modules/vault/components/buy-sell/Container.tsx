import { Box, BoxProps } from '@chakra-ui/react';

export const Container = ({ ...rest }: BoxProps) => {
  return <Box maxW="600px" w="full" mx="auto" {...rest} />;
};
