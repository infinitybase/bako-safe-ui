import {
  Container as ContainerChakra,
  ContainerProps as ContainerChakraProps,
} from '@chakra-ui/react';

export interface ContainerProps extends ContainerChakraProps {}

const Container = ({ children, ...props }: ContainerProps) => {
  return (
    <ContainerChakra maxWidth="container.xl" {...props}>
      {children}
    </ContainerChakra>
  );
};

export { Container };
