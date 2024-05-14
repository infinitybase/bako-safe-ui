import { Box, useMediaQuery, VStack } from '@chakra-ui/react';
import React from 'react';

import logo from '@/assets/bakoLogoDark.svg';
import bakoSymbol from '@/assets/bakoSymbol.svg';
import { useScreenSize } from '@/modules/core';

interface SigninContainerBackgroundProps {
  children: React.ReactNode;
}

interface SigninContainerProps {
  children: React.ReactNode;
}

const SigninContainerBackground = ({
  children,
}: SigninContainerBackgroundProps) => {
  return (
    <Box
      overflow="hidden"
      __css={{
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        '&::-webkit-scrollbar-thumb': {
          display: 'none',
        },
      }}
      zIndex="0"
      minW={320}
      w="100vw"
      h="100vh"
      display="flex"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      backgroundImage="url('backgroundHome.png')"
      backgroundSize="cover"
      backgroundPosition="unset"
      p={4}
    >
      {children}
    </Box>
  );
};

const SigninContainerMobile = (props: SigninContainerProps) => {
  const isLowerThanMobile = useMediaQuery('(max-width: 30em)');

  return (
    <SigninContainerBackground>
      <VStack
        position="relative"
        borderRadius="10px"
        backgroundColor="dark.50"
        backdropFilter="blur(6px)"
        display="flex"
        minW={isLowerThanMobile[0] ? '90vw' : '55vw'}
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
    </SigninContainerBackground>
  );
};

const SigninContainer = (props: SigninContainerProps) => {
  const { isSmHeight, isSmallHeight, isMdHeight } = useScreenSize();

  return (
    <SigninContainerBackground>
      <Box
        borderRadius="10px"
        backgroundColor="dark.50"
        backdropFilter="blur(6px)"
        minH={isMdHeight ? '90vh' : '41.25rem'}
        minW={{ md: '85vw', lg: '75vw', xl: '65rem' }}
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
              left: '96.5%',
              transform: 'translate(-50%, -50%)',
              minWidth: '120%',
            }}
          />
        </Box>

        <Box
          flex={isSmHeight ? 4 : isSmallHeight ? 3 : 2}
          mr={16}
          ml={isSmHeight ? '15.5%' : isSmallHeight ? '17.5%' : '20.5%'}
          py={8}
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
    </SigninContainerBackground>
  );
};

export { SigninContainer, SigninContainerMobile };
