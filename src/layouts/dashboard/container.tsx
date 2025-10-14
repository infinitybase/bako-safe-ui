import {
  Box,
  Container as ContainerChakra,
  ContainerProps as ContainerChakraProps,
} from 'bako-ui';

export interface ContainerProps extends ContainerChakraProps {}

const Container = ({ children, ...props }: ContainerProps) => {
  return (
    <ContainerChakra
      maxWidth="full"
      h="$100vh"
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
