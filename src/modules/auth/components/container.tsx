import { Box, useMediaQuery, VStack } from '@chakra-ui/react';
import React from 'react';

import bakoSymbol from '@/assets/bakoSymbol.svg';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

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
      h="100vh"
      w="100%"
      display="flex"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
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
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: '100%',
            maxHeight: '10.75rem',
          }}
        />

        <Box
          w="full"
          minH={173}
          display="flex"
          backgroundColor="brand.500"
          bgGradient="linear(to-br, brand.500 , brand.800)"
          borderRadius="10px 10px 0px 0px"
          p={6}
          pl={{ base: '40%', sm: '30%' }}
          mb={16}
        />

        {props.children}
      </VStack>
    </SigninContainerBackground>
  );
};

const SigninContainer = (props: SigninContainerProps) => {
  const {
    screenSizes: { isSmallHeight, isMdHeight },
  } = useWorkspaceContext();

  return (
    <Box display="flex" minH="100vh" w="100%">
      <Box
        flex={1}
        display="flex"
        backgroundColor="dark.50"
        backdropFilter="blur(6px)"
      >
        <Box
          backgroundColor="brand.500"
          bgGradient="linear(to-br, brand.500 , brand.800)"
          display="flex"
          position="relative"
          flex={1}
        >
          <img
            src={bakoSymbol}
            alt=""
            style={{
              position: 'absolute',
              top: '50%',
              left: '98%',
              transform: 'translate(-50%, -50%)',
              minWidth: '75%',
            }}
          />
        </Box>

        <Box
          pl={{ base: '10%', lg: '8%', xl: '5%' }}
          display="flex"
          flex={isSmallHeight ? 4 : isMdHeight ? 3 : 2}
          justifyContent="center"
        >
          <VStack flex={1} p={4} maxW={400}>
            {props.children}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export { SigninContainer, SigninContainerMobile };
