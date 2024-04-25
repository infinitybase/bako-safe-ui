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
        backgroundColor="dark.50"
        display="flex"
        minW={isLowerThanMobile[0] ? '90vw' : '70vw'}
        minH="25vh"
        spacing={0}
        border={'1px solid transparent'}
        borderColor="dark.150"
        boxShadow="lg"
      >
        <img
          src={bakoSymbol}
          alt=""
          style={{
            position: 'absolute',
            top: '117px',
            left: '77px',
            transform: 'translate(-50%, -50%)',
            height: '100%',
            maxHeight: '10.75rem',
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
        minW={{ md: '85vw', lg: '75vw', xl: '65vw', '2xl': '55vw' }}
        display="flex"
        alignItems="stretch"
        border={'1px solid transparent'}
        borderColor="dark.150"
        boxShadow="lg"
      >
        <Box
          flex={1}
          backgroundColor="brand.500"
          bgGradient="linear(to-br, brand.500 , brand.800)"
          borderRadius="10px 0px 0px 10px"
          p={3}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          flexDirection="column"
          position="relative"
        >
          <img
            src={logo}
            alt=""
            style={{
              width: '65%',
              marginTop: 'auto',
            }}
          />
          <img
            src={bakoSymbol}
            alt=""
            style={{
              position: 'absolute',
              top: '50%',
              left: '96.5%', // Para centralizar a imagem no meio da caixa
              transform: 'translate(-50%, -50%)', // Para
              minWidth: '120%',
            }}
          />
        </Box>

        <Box
          flex={2}
          mr={16}
          ml={52}
          pt={12}
          position="sticky"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-evenly"
          gap={4}
        >
          {props.children}
        </Box>
      </Box>
    </>
  );
};

export { SigninContainer, SigninContainerMobile };
