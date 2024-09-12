import { Heading, Icon, Link, Text, VStack } from '@chakra-ui/react';
import { FiArrowUpRight } from 'react-icons/fi';

import { useScreenSize } from '@/modules/core/hooks';

const SignInFooter = () => {
  const { isMobile } = useScreenSize();

  return (
    <VStack spacing={1} textAlign="center" mt={isMobile ? 6 : 0}>
      <Heading fontSize="sm" color="grey.75">
        New to Fuel Network?
      </Heading>

      <Link
        fontSize="xs"
        color="grey.250"
        href="https://www.fuel.network/"
        target="_blank"
        display="flex"
        gap={1}
        textDecoration="none"
        fontWeight="medium"
        borderRadius={8}
        _hover={{
          textDecoration: 'none',
          color: 'grey.75',
        }}
      >
        <Text fontSize="xs" fontWeight="normal">
          Learn more
        </Text>
        <Icon as={FiArrowUpRight} fontSize="md" />
      </Link>
    </VStack>
  );
};

export { SignInFooter };
