import { AttachmentIcon } from '@chakra-ui/icons';
import { Box, Button, Text } from '@chakra-ui/react';

import doubleB from '@/assets/doubleB.svg';
import logo from '@/assets/logoDark.svg';

import { useSignIn } from '../hooks';

const SigninPage = () => {
  const { isConnected, isConnecting, goToApp } = useSignIn();

  return (
    <>
      <Box
        zIndex="0"
        w="100vw"
        h="100vh"
        display="flex"
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
        backgroundImage="url('backgroundHome.png')"
        backgroundSize="cover"
        backgroundPosition="unset"
        style={{ filter: 'blur(12px)' }} // Adicionando o desfoque aqui
      />
      <Box
        position="absolute"
        zIndex={1}
        borderRadius="10px"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        backgroundColor="dark.500"
        minH="80vh"
        minW="50vw"
        display="flex"
        alignItems="center"
      >
        <Box
          w="30%"
          h="80vh"
          backgroundColor="green.300"
          borderRadius="10px 0px 0px 10px"
          p={10}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          flexDirection="column"
        >
          <img
            src={logo}
            alt=""
            style={{
              width: '60%',
              //height: '60%',
            }}
          />
          <img
            src={doubleB}
            alt=""
            style={{
              position: 'absolute',
              top: '50%',
              left: '18%', // Para centralizar a imagem no meio da caixa
              transform: 'translate(-50%, -50%)', // Para
              width: '35%',
              height: '80%',
            }}
          />
        </Box>

        <Box
          m={10}
          ml={20}
          w="50%"
          position="sticky"
          display="flex"
          flexDirection="column"
          alignItems="start"
          justifyContent="center"
        >
          <Box textAlign="center">
            <Text color="white" fontSize="4xl">
              <Text as="b" color="brand.500">
                Hey!
              </Text>
            </Text>
          </Box>
          <Box textAlign="start">
            <Text color="gray.200" fontSize="2xl" fontWeight="bold">
              Click the button bellow to connect your wallet to BSAFE.
            </Text>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            my={5}
          >
            <Button
              size="lg"
              color="dark.500"
              fontWeight="bold"
              variant="solid"
              backgroundColor="green.300"
              colorScheme="brand"
              isLoading={isConnecting}
              loadingText="Connecting.."
              onClick={goToApp}
              leftIcon={<AttachmentIcon />}
            >
              Connect Wallet
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export { SigninPage };
