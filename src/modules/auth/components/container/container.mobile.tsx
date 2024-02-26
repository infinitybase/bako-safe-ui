import { VStack } from '@chakra-ui/react';
import React from 'react';

import bakoSymbol from '@/assets/bakoSymbol.svg';

import { SigninContainerBackground } from './background';
interface SigninContainerMobileProps {
  children: React.ReactNode;
}

const SigninContainerMobile = (props: SigninContainerMobileProps) => {
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
        minW="90vw"
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

export { SigninContainerMobile };
