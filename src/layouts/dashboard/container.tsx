import {
  Box,
  Container as ContainerChakra,
  ContainerProps as ContainerChakraProps,
} from '@chakra-ui/react';

import HomeBackgroundHd from '@/assets/home-background-hd.png';

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
      <Box
        backgroundImage={HomeBackgroundHd}
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        backgroundAttachment="fixed"
      >
        {children}
      </Box>
    </ContainerChakra>
  );
};

export { Container };
