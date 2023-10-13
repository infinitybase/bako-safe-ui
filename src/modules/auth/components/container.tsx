import { Box } from '@chakra-ui/react';
import React from 'react';

import doubleB from '@/assets/doubleB.svg';
import logo from '@/assets/logoDark.svg';

interface SigninContainerProps {
  children: React.ReactNode;
}

const SigninContainer = (props: SigninContainerProps) => {
  return (
    <>
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
      <Box
        position="absolute"
        zIndex={1}
        borderRadius="10px"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        backgroundColor="dark.500"
        minH="80vh"
        minW="50vw"
        display="flex"
        alignItems="center"
      >
        <Box
          w="30%"
          h="80vh"
          backgroundColor="brand.500"
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
              width: '60%',
              //height: '60%',
            }}
          />
          <img
            src={doubleB}
            alt=""
            style={{
              position: 'absolute',
              top: '50%',
              left: '18%', // Para centralizar a imagem no meio da caixa
              transform: 'translate(-50%, -50%)', // Para
              width: '35%',
              height: '80%',
            }}
          />
        </Box>

        <Box
          m={10}
          ml={20}
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

export { SigninContainer };
