import { Box, BoxProps } from '@chakra-ui/react';

export interface CardProps extends BoxProps {}

const Card = (props: CardProps) => {
  const { children, ...rest } = props;

  return (
    <Box
      borderWidth={1}
      borderColor="dark.100"
      bg="dark.300"
      borderRadius={10}
      padding={6}
      {...rest}
    >
      {children}
    </Box>
  );
};

export { Card };
