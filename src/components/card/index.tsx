import { Box, BoxProps } from '@chakra-ui/react';

export interface CardProps extends BoxProps {}

const Card = (props: CardProps) => {
  const { children, ...rest } = props;

  return (
    <Box
      bg="dark.200"
      borderWidth={1}
      borderColor="dark.100"
      borderRadius={5}
      padding={6}
      {...rest}
    >
      {children}
    </Box>
  );
};

export { Card };
