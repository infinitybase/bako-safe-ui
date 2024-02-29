import {
  Container as ContainerChakra,
  ContainerProps as ContainerChakraProps,
} from '@chakra-ui/react';

import HomeBackground from '@/assets/home-background.png';

export interface ContainerProps extends ContainerChakraProps {}

const Container = ({ children, ...props }: ContainerProps) => {
  return (
    <ContainerChakra
      maxWidth="full"
      h="100vh"
      bgColor="grey.850"
      display="flex"
      flexDirection="column"
      backgroundImage={HomeBackground}
      backgroundSize={'cover'}
      backgroundRepeat={'no-repeat'}
      p={0}
      {...props}
    >
      {children}
    </ContainerChakra>
  );
};

export { Container };
