import { Box, VStack } from '@chakra-ui/react';
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
      style={{ filter: 'blur(12px)' }} // Adicionando o desfoque aqui
    />
  );
};

const SigninContainerMobile = (props: SigninContainerProps) => {
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
        minW="80vw"
        minH="22vh"
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
            height: '70%',
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
        backgroundColor="dark.600"
        minH="80vh"
        minW="55vw"
        display="flex"
        alignItems="center"
      >
        <Box
          w="35%"
          h="80vh"
          backgroundColor="brand.500"
          bgGradient="linear(to-br, brand.500 , brand.800)"
          borderRadius="10px 0px 0px 10px"
          p={10}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          flexDirection="column"
        >
          <img
            src={logo}
            alt=""
            style={{
              width: '90%',
              //height: '60%',
            }}
          />
          <img
            src={bakoSymbol}
            alt=""
            style={{
              position: 'absolute',
              top: '52%',
              left: '30%', // Para centralizar a imagem no meio da caixa
              transform: 'translate(-50%, -50%)', // Para
              width: '45%',
              height: '75%',
            }}
          />
        </Box>

        <Box
          m={10}
          ml={52}
          w="50%"
          position="sticky"
          display="flex"
          flexDirection="column"
          alignItems="start"
          justifyContent="center"
        >
          {props.children}
        </Box>
      </Box>
    </>
  );
};

export { SigninContainer, SigninContainerMobile };
