import { Box, Container, Image, VStack } from 'bako-ui';
import React from 'react';

import bakoSymbol from '@/assets/bako-safe.svg';

interface SigninContainerProps {
  children: React.ReactNode;
}

const SigninContainerMobile = (props: SigninContainerProps) => {
  return (
    <VStack
      position="relative"
      w="100%"
      minH="100vh"
      gap={0}
      overflow="hidden"
      justifyContent="center"
      gapY={20}
    >
      <Box w="full" mt="-90px" display="flex" justifyContent="center">
        <Image
          src={bakoSymbol}
          alt="Bako Safe"
          style={{
            height: '100%',
          }}
        />
      </Box>

      <VStack flex={{ base: 0, md: 1 }} w="full">
        {props.children}
      </VStack>
    </VStack>
  );
};

const SigninContainer = (props: SigninContainerProps) => {
  return (
    <Container display="flex" minH="100vh" w="100%">
      <Box flex={1} display="flex">
        <Box
          display="flex"
          position="relative"
          flex={1}
          w="1/2"
          justifyContent="center"
          alignItems="center"
        >
          <Image src={bakoSymbol} alt="" height="80px" width="218px" />
        </Box>

        <Box w="1/2" display="flex" justifyContent="center" flex={1}>
          <VStack flex={1} p={4}>
            {props.children}
          </VStack>
        </Box>
      </Box>
    </Container>
  );
};

export { SigninContainer, SigninContainerMobile };
