import { Box, Image, VStack } from 'bako-ui';
import React from 'react';

import bakoSymbol from '@/assets/images/bako-safe.png';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface SigninContainerProps {
  children: React.ReactNode;
}

const SigninContainerMobile = (props: SigninContainerProps) => {
  return (
    <VStack
      position="relative"
      backgroundColor="dark.50"
      backdropFilter="blur(6px)"
      w="100%"
      minH="100vh"
      gap={0}
      overflow="hidden"
      css={{
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        '&::-webkit-scrollbar-thumb': {
          display: 'none',
        },
      }}
    >
      <Box
        w="full"
        minH={202}
        backgroundColor="brand.500"
        bgGradient="linear(to-br, brand.500 , brand.800)"
      >
        <img
          src={bakoSymbol}
          alt=""
          style={{
            position: 'absolute',
            top: '131px',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: '100%',
            maxHeight: '13.9rem',
          }}
        />
      </Box>

      <VStack flex={1} w="full">
        {props.children}
      </VStack>
    </VStack>
  );
};

const SigninContainer = (props: SigninContainerProps) => {
  const {
    screenSizes: { isSmallHeight, isMdHeight },
  } = useWorkspaceContext();

  return (
    <Box
      display="flex"
      minH="100vh"
      w="100%"
      overflow="hidden"
      css={{
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        '&::-webkit-scrollbar-thumb': {
          display: 'none',
        },
      }}
    >
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
          maxW="35rem"
        >
          <Image
            src={bakoSymbol}
            alt=""
            style={{
              position: 'absolute',
              top: '50%',
              left: '97.75%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </Box>

        <Box
          pl={{ base: '10%', lg: '8%', xl: '5%' }}
          display="flex"
          flex={isSmallHeight ? 4 : isMdHeight ? 3 : 2}
          justifyContent="center"
        >
          <VStack flex={1} p={4}>
            {props.children}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export { SigninContainer, SigninContainerMobile };
