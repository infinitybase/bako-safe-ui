import { AttachmentIcon } from '@chakra-ui/icons';
import { Box, Button, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { useContactToast } from '@/modules/addressBook';
import {
  DrawerConnector,
  SigninContainer,
  SigninContainerMobile,
} from '@/modules/auth/components';
import { useScreenSize } from '@/modules/core';

import { DrawerWebAuthn } from '../components';
const SigninPage = () => {
  const {
    isConnecting,
    connectors,
    redirectToWalletLink,
    auth,
    webauthn: { isOpen, closeWebAuthnDrawer },
  } = useSignIn();
  const { errorToast } = useContactToast();
  const { isMobile } = useScreenSize();

  useMemo(() => {
    auth.isInvalidAccount &&
      errorToast({
        title: 'Invalid Account',
        description: 'You need to use the fuel wallet to connect.',
      });
    auth.handlers.setInvalidAccount(false);
  }, [auth.isInvalidAccount]);

  const pageSections = {
    description: connectors.has
      ? 'Click the button bellow to connect Bako Safe.'
      : 'You need to use the fuel wallet to connect.',
    action: connectors.has ? (
      <Button
        size={{
          base: 'md',
          sm: 'lg',
        }}
        color="dark.500"
        fontWeight="bold"
        variant="solid"
        backgroundColor="brand.500"
        colorScheme="brand"
        backgroundSize="200% 100%"
        backgroundPosition="100% 0"
        transition="background-position .5s"
        _hover={{
          transform: 'scale(1.05)',
          transition: 'ease-in-out .3s',
        }}
        isLoading={isConnecting}
        loadingText="Connecting.."
        onClick={connectors.drawer.onOpen}
        leftIcon={<AttachmentIcon />}
      >
        Connect Wallet
      </Button>
    ) : (
      <Button
        size="lg"
        color="grey.200"
        bgColor="dark.100"
        variant="secondary"
        borderColor="dark.100"
        leftIcon={<AttachmentIcon />}
        onClick={redirectToWalletLink}
      >
        Fuel Wallet
      </Button>
    ),
  };

  if (isMobile) {
    return (
      <SigninContainerMobile>
        <DrawerConnector
          isOpen={connectors.drawer.isOpen}
          onClose={connectors.drawer.onClose}
          onSelect={connectors.select}
          connectors={connectors.items}
        />
        <Box
          w="full"
          backgroundColor="brand.500"
          bgGradient="linear(to-br, brand.500 , brand.800)"
          borderRadius="10px 10px 0px 0px"
          p={6}
          pl="40%"
        >
          <Box textAlign="end" mb={3}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              bgClip="text"
              color="dark.300"
            >
              Hello,
            </Text>
          </Box>
          <Box textAlign="end">
            <Text fontSize="small" fontWeight="semibold" color="dark.300">
              {pageSections.description}
            </Text>
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end" w="full" p={6}>
          {pageSections.action}
        </Box>
      </SigninContainerMobile>
    );
  }

  return (
    <SigninContainer>
      <DrawerConnector
        isOpen={connectors.drawer.isOpen}
        onClose={connectors.drawer.onClose}
        onSelect={connectors.select}
        connectors={connectors.items}
      />
      <DrawerWebAuthn
        isOpen={isOpen} // todo: move the complete item with webauthn to component
        onClose={closeWebAuthnDrawer}
      />
      <Box textAlign="center" mb={2}>
        <Text
          fontSize="4xl"
          fontWeight="bold"
          bgGradient="linear(to-r, brand.500, brand.800)"
          bgClip="text"
        >
          Hello,
        </Text>
      </Box>
      <Box textAlign="start" mb={5} maxW={305}>
        <Text color="white" fontWeight="bold">
          {pageSections.description}
        </Text>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        my={5}
      >
        {pageSections.action}
      </Box>
    </SigninContainer>
  );
};

export { SigninPage };
