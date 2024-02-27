import { AttachmentIcon } from '@chakra-ui/icons';
import { Box, Button, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import { useContactToast } from '@/modules/addressBook';
import {
  DrawerConnector,
  DrawerWebAuthn,
  SigninContainer,
} from '@/modules/auth/components';

import { useSignIn } from '../hooks';

const SigninPage = () => {
  const {
    isConnecting,
    connectors,
    redirectToWalletLink,
    auth,
    webauthn: { isOpen, closeWebAuthnDrawer },
  } = useSignIn();
  const { errorToast } = useContactToast();

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
      ? 'Click the button bellow to connect your wallet to BSAFE.'
      : 'You need to use the fuel wallet to connect.',
    action: connectors.has ? (
      <Button
        size="lg"
        color="dark.500"
        fontWeight="bold"
        variant="solid"
        backgroundColor="brand.500"
        colorScheme="brand"
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
        <Text fontSize="4xl" fontWeight="bold" color="brand.500">
          Hey!
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
