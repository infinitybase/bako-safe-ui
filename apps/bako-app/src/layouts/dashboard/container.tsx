import {
  Box,
  Container as ContainerChakra,
  type ContainerProps as ContainerChakraProps,
} from '@chakra-ui/react';

export interface ContainerProps extends ContainerChakraProps {}

const Container = ({ children, ...props }: ContainerProps) => {
  return (
    <ContainerChakra
      maxWidth="full"
      h="100vh"
      display="flex"
      flexDirection="column"
      p={0}
      {...props}
    >
      <Box>{children}</Box>
    </ContainerChakra>
  );
};

export { Container };
