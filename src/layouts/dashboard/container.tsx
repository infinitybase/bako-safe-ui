import {
  Box,
  Container as ContainerChakra,
  ContainerProps as ContainerChakraProps,
} from '@chakra-ui/react';

export interface ContainerProps extends ContainerChakraProps {}

const Container = ({ children, ...props }: ContainerProps) => {
  return (
    <ContainerChakra
      maxWidth="full"
      h="$100vh"
      display="flex"
      flexDirection="column"
      p={0}
      overflowX={'hidden'}
      {...props}
    >
      <Box>{children}</Box>
    </ContainerChakra>
  );
};

export { Container };
