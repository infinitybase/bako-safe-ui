import { Heading, Icon, Link, Text, VStack } from '@chakra-ui/react';
import { FiArrowUpRight } from 'react-icons/fi';

const SignInFooter = () => (
  <VStack spacing={1}>
    <VStack spacing={0} textAlign="center">
      <Heading fontSize="sm" color="grey.50">
        New to Fuel Network?
      </Heading>
      <Text fontSize="xs" color="grey.500">
        Fuel is an operating system purpose-built for Ethereum rollups
      </Text>
    </VStack>
    <Link
      fontSize="xs"
      color="grey.100"
      href="https://www.fuel.network/"
      target="_blank"
      display="flex"
      gap={2}
      p={2}
      textDecoration="none"
      fontWeight="medium"
      borderRadius={8}
      _hover={{
        textDecoration: 'none',
        bgColor: 'dark.100',
      }}
    >
      <Text fontSize="xs" fontWeight="normal">
        Learn more about Fuel
      </Text>
      <Icon as={FiArrowUpRight} fontSize="md" />
    </Link>
  </VStack>
);

export { SignInFooter };
