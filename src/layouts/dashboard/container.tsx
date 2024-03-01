import {
  Box,
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
      bgGradient="linear(to-b, dark.600 30%, #1E1F2280 70%)"
      display="flex"
      flexDirection="column"
      p={0}
      {...props}
    >
      <Box
        backgroundImage={HomeBackground}
        backgroundSize={'cover'}
        backgroundRepeat={'no-repeat'}
        backgroundPosition="0px 650px"
      >
        {children}
      </Box>
    </ContainerChakra>
  );
};

export { Container };
