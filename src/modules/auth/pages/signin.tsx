import { Box, Button, Text } from '@chakra-ui/react';

import logo from '@/assets/logo.svg';

import { useSignIn } from '../hooks';

const SigninPage = () => {
  const { isConnected, isConnecting, goToApp } = useSignIn();

  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
    >
      <Box mb={10}>
        <img src={logo} alt="" />
      </Box>

      <Box mb={20}>
        <Box textAlign="center">
          <Text color="white" fontSize="4xl">
            Welcome to{' '}
            <Text as="b" color="brand.500">
              BSAFE
            </Text>
          </Text>
        </Box>
        <Box textAlign="center">
          <Text color="gray.400" fontSize="lg">
            Click the button bellow to connect <br /> your wallet to BSAFE.
          </Text>
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Button
          size="lg"
          color="brand.900"
          variant="solid"
          colorScheme="brand"
          isLoading={isConnecting}
          loadingText="Connecting.."
          onClick={goToApp}
        >
          Connect Wallet
        </Button>
      </Box>
    </Box>
  );
};

export { SigninPage };
