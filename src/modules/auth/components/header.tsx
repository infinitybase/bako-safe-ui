import { Text, VStack } from '@chakra-ui/react';

import { useScreenSize } from '@/modules/core';

interface SignInHeaderProps {
  title: string;
}

const SignInHeader = ({ title }: SignInHeaderProps) => {
  const { isMobile } = useScreenSize();

  return (
    <VStack justifyContent="center" textAlign="center" w="full" spacing={2}>
      <Text
        fontSize={isMobile ? '2xl' : '32'}
        fontWeight="bold"
        bgGradient="linear(to-br, brand.500, brand.800)"
        bgClip="text"
      >
        {title}
      </Text>
      <Text color="grey.50" lineHeight="16.94px" fontWeight={400} fontSize="sm">
        Choose your prefered login method
      </Text>
    </VStack>
  );
};

export { SignInHeader };
