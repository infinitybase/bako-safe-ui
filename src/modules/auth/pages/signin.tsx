import { AttachmentIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Icon,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';

import { useContactToast } from '@/modules/addressBook';
import {
  CardConnector,
  DrawerConnector,
  DrawerWebAuthn,
  SigninContainer,
  SigninContainerMobile,
} from '@/modules/auth/components';
import { useScreenSize } from '@/modules/core';
import { EConnectors } from '@/modules/core/hooks/fuel/useListConnectors';

import { useSignIn } from '../hooks/useSignIn';

const SigninPage = () => {
  const {
    isConnecting,
    connectors,
    redirectToWalletLink,
    auth,
    webauthn: { isOpen, closeWebAuthnDrawer, ...rest },
  } = useSignIn();
  const { errorToast } = useContactToast();
  const { isMobile, isExtraSmall } = useScreenSize();

  const webAuthnConnector = connectors.items.find(
    (connector) => connector.name === EConnectors.WEB_AUTHN,
  );

  const allOtherConnectors = connectors.items.filter(
    (connector) => connector.name !== EConnectors.WEB_AUTHN,
  );

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
          base: isExtraSmall ? 'sm' : 'md',
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
        width={isExtraSmall ? 150 : 'unset'}
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
      {WebauthnDrawer}
      <VStack justifyContent="center" textAlign="center" w="full" spacing={0}>
        <Text
          fontSize={32}
          fontWeight="bold"
          bgGradient="linear(to-br, brand.500, brand.800)"
          bgClip="text"
        >
          Welcome to multisig
        </Text>
        <Text color="grey.100" fontSize="sm" maxW={366}>
          Robust security. Uncompromising performance. The ultimate Multisig
          Wallet experience for the Rollup OS.
        </Text>
      </VStack>

      <VStack spacing={8} w="full">
        <CardConnector
          connector={webAuthnConnector!}
          isWebAuthn
          onClick={connectors.select}
        />

        <HStack w="full" spacing={5}>
          <Divider borderColor="grey.500" />
          <Text color="grey.250" fontSize="xs" fontWeight="light">
            OR
          </Text>
          <Divider borderColor="grey.500" />
        </HStack>

        <HStack w="full" spacing={2}>
          {allOtherConnectors.map((connector) => (
            <CardConnector
              key={connector.name}
              connector={connector}
              onClick={connectors.select}
            />
          ))}
        </HStack>
      </VStack>

      <VStack spacing={1}>
        <VStack spacing={0} textAlign="center">
          <Heading fontSize="sm">New to Fuel Network?</Heading>
          <Text fontSize="xs" color="grey.500">
            {"Fuel is the world's fastest modular execution layer."}
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
          <Text fontSize="xs">Learn more about Fuel</Text>
          <Icon as={FiArrowUpRight} fontSize="md" />
        </Link>
      </VStack>
    </SigninContainer>
  );
};

export { SigninPage };
