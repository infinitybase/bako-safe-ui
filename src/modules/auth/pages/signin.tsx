import { Box, Text } from '@chakra-ui/react';
import { useMemo } from 'react';

import { useContactToast } from '@/modules/addressBook';
import {
  DrawerConnector,
  DrawerWebAuthn,
  SigninContainer,
  SigninContainerMobile,
} from '@/modules/auth/components';
import { useScreenSize } from '@/modules/core';

import { ActionButton } from '../components/actionButton';
import { useSignIn } from '../hooks/useSignIn';

const SigninPage = () => {
  const {
    isConnecting,
    connectors,
    auth,
    webauthn: { isOpen, closeWebAuthnDrawer, ...rest },
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
    description: 'Click the button bellow to connect Bako Safe.',
    action: (
      <ActionButton
        isLoading={isConnecting}
        onClick={connectors.drawer.onOpen}
      />
    ),
  };

  const WebauthnDrawer = (
    <DrawerWebAuthn
      isOpen={isOpen} // todo: move the complete item with webauthn to component
      onClose={closeWebAuthnDrawer}
      webauthn={{
        ...rest,
        isOpen,
        closeWebAuthnDrawer,
      }}
    />
  );

  if (isMobile) {
    return (
      <SigninContainerMobile>
        <DrawerConnector
          isOpen={connectors.drawer.isOpen}
          onClose={connectors.drawer.onClose}
          onSelect={connectors.select}
          connectors={connectors.items}
        />
        {WebauthnDrawer}
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
      {WebauthnDrawer}
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
