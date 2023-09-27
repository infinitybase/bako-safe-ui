import {
  Container as ContainerChakra,
  ContainerProps as ContainerChakraProps,
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
      {children}
    </ContainerChakra>
  );
};

export { Container };
