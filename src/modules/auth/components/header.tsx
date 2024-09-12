import { Text, VStack } from '@chakra-ui/react';

interface SignInHeaderProps {
  title: string;
}

const SignInHeader = ({ title }: SignInHeaderProps) => {
  return (
    <VStack justifyContent="center" textAlign="center" w="full" spacing={0}>
      <Text
        fontSize={{ base: '2xl', md: '32' }}
        fontWeight="bold"
        bgGradient="linear(to-br, brand.500, brand.800)"
        bgClip="text"
      >
        {title}
      </Text>
    </VStack>
  );
};

export { SignInHeader };
