import { Box, Heading, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';

import { useContactToast } from '@/modules/addressBook';
import {
  ConnectorsList,
  DrawerWebAuthn,
  SigninContainer,
  SigninContainerMobile,
  SignInFooter,
} from '@/modules/auth/components';
import { useScreenSize } from '@/modules/core';

import { useSignIn } from '../hooks/useSignIn';
import {
  DiscordIcon,
  TelegramIcon,
  TwitterIcon,
} from '@/components/icons/social';
import { Link } from 'react-router-dom';

const SigninPage = () => {
  const {
    connectors,
    auth,
    webauthn: { isOpen, closeWebAuthnDrawer, ...rest },
  } = useSignIn();
  const { errorToast } = useContactToast();
  const { isMobile } = useScreenSize();

  const pageSections = {
    title: 'Welcome to Bako Safe',
  };

  useEffect(() => {
    auth.invalidAccount &&
      errorToast({
        title: 'Invalid Account',
        description: 'You need to use the fuel wallet to connect.',
      });
    auth.handlers.setInvalidAccount?.(false);
  }, [auth.invalidAccount]);

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
        {WebauthnDrawer}
        <Box
          w="full"
          minH={173}
          display="flex"
          backgroundColor="brand.500"
          bgGradient="linear(to-br, brand.500 , brand.800)"
          borderRadius="10px 10px 0px 0px"
          p={6}
          pl={{ base: '40%', sm: '30%' }}
        >
          <Box
            flex={1}
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Heading
              fontSize={28}
              fontWeight="extrabold"
              bgClip="text"
              color="dark.300"
              textAlign="end"
            >
              {pageSections.title}
            </Heading>
          </Box>
        </Box>

        <VStack
          justifyContent="center"
          w="full"
          // pt={14}
          // pb={2}
          px={6}
          spacing={8}
          // comming soon part

          minH="325px"
        >
          <Heading
            fontWeight={700}
            fontSize="24px"
            textAlign="center"
            sx={{
              background:
                'linear-gradient(132.19deg, #FFC010 0%, #EBA312 48%, #D38015 71%, #B24F18 99%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome to Bako Safe
          </Heading>

          <Text
            maxW="491px"
            fontSize="14px"
            fontWeight={500}
            textAlign="center"
            color="grey.75"
          >
            We are excited to announce that something amazing is on the way!
            Bako Safe will be available soon. Stay tuned for updates and get
            ready to explore a new world of possibilities!
          </Text>
          <HStack spacing="24px">
            <Link to="https://x.com/bakosafe" target="_blank">
              <Icon as={TwitterIcon} fontSize={24} />
            </Link>
            <Link to="https://discord.com/invite/E5kYKSKncj" target="_blank">
              <Icon as={DiscordIcon} fontSize={24} />
            </Link>
            <Link to="https://t.me/BSAFE_fuel" target="_blank">
              <Icon as={TelegramIcon} fontSize={24} />
            </Link>
          </HStack>
          {/* <ConnectorsList
            connectors={connectors.items}
            onSelect={connectors.select}
            isAnyWalletConnectorOpen={connectors.isAnyWalletConnectorOpen}
          />

          <SignInFooter /> */}
        </VStack>
      </SigninContainerMobile>
    );
  }

  return (
    <SigninContainer>
      {WebauthnDrawer}
      <VStack
        justifyContent="center"
        textAlign="center"
        w="full"
        spacing="40px"
      >
        <Text
          fontSize={32}
          fontWeight="bold"
          bgGradient="linear(to-br, brand.500, brand.800)"
          bgClip="text"
        >
          {pageSections.title}
        </Text>

        {/* Comming Soon part */}
        <Text
          maxW="491px"
          fontSize="14px"
          fontWeight={500}
          textAlign="center"
          color="grey.75"
        >
          We are excited to announce that something amazing is on the way! Bako
          Safe will be available soon. Stay tuned for updates and get ready to
          explore a new world of possibilities!
        </Text>

        <HStack spacing="24px">
          <Link to="https://x.com/bakosafe" target="_blank">
            <Icon as={TwitterIcon} fontSize={24} />
          </Link>
          <Link to="https://discord.com/invite/E5kYKSKncj" target="_blank">
            <Icon as={DiscordIcon} fontSize={24} />
          </Link>
          <Link to="https://t.me/BSAFE_fuel" target="_blank">
            <Icon as={TelegramIcon} fontSize={24} />
          </Link>
        </HStack>
      </VStack>

      {/* <ConnectorsList
        connectors={connectors.items}
        onSelect={connectors.select}
        isAnyWalletConnectorOpen={connectors.isAnyWalletConnectorOpen}
      />

      <SignInFooter /> */}
    </SigninContainer>
  );
};

export { SigninPage };
