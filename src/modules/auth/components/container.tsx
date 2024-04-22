import { Box, useMediaQuery, VStack } from '@chakra-ui/react';
import React from 'react';

import logo from '@/assets/bakoLogoDark.svg';
import bakoSymbol from '@/assets/bakoSymbol.svg';

interface SigninContainerProps {
  children: React.ReactNode;
}

const SigninContainerBackground = () => {
  return (
    <Box
      zIndex="0"
      w="100vw"
      h="100vh"
      display="flex"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      backgroundImage="url('backgroundHome.png')"
      backgroundSize="cover"
      backgroundPosition="unset"
    />
  );
};

const SigninContainerMobile = (props: SigninContainerProps) => {
  const isLowerThanMobile = useMediaQuery('(max-width: 30em)');

  return (
    <>
      <SigninContainerBackground />
      <VStack
        position="absolute"
        zIndex={1}
        borderRadius="10px"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        backgroundColor="dark.600"
        display="flex"
        minW={isLowerThanMobile[0] ? '90vw' : '70vw'}
        minH="25vh"
        spacing={0}
      >
        <img
          src={bakoSymbol}
          alt=""
          style={{
            position: 'absolute',
            top: '50%',
            left: '20%',
            transform: 'translate(-50%, -50%)',
            height: '75%',
          }}
        />
        {props.children}
      </VStack>
    </>
  );
};

const SigninContainer = (props: SigninContainerProps) => {
  return (
    <>
      <SigninContainerBackground />
      <Box
        position="absolute"
        zIndex={1}
        borderRadius="10px"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        backgroundColor="dark.50"
        minH="80vh"
        minW="55vw"
        display="flex"
        alignItems="center"
        border={'1px solid transparent'}
        borderColor="dark.150"
        boxShadow="lg"
      >
        <Box
          w="35%"
          h="80vh"
          backgroundColor="brand.500"
          bgGradient="linear(to-br, brand.500 , brand.800)"
          borderRadius="10px 0px 0px 10px"
          p={{ md: 0, lg: 10 }}
          pb={{ md: 3.5, lg: 3.5 }}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          flexDirection="column"
        >
          <img
            src={logo}
            alt=""
            style={{
              width: '85%',
              maxWidth: '11rem',
              marginTop: 'auto',
            }}
          />
          <img
            src={bakoSymbol}
            alt=""
            style={{
              position: 'absolute',
              top: '50%',
              left: '30%', // Para centralizar a imagem no meio da caixa
              transform: 'translate(-50%, -50%)', // Para
              width: '45%',
              height: '75%',
            }}
          />
        </Box>

        <Box
          mr={{ base: 12, '2xl': 16 }}
          ml={52}
          w="50%"
          h="80vh"
          position="sticky"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-evenly"
        >
          {props.children}
        </Box>
      </Box>
    </>
  );
};

export { SigninContainer, SigninContainerMobile };
