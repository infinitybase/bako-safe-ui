import { Box, BoxProps } from 'bako-ui';

export const Container = ({ ...rest }: BoxProps) => {
  return <Box maxW="600px" w="full" mx="auto" {...rest} />;
};
