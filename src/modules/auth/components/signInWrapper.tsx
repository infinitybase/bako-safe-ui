import { Box, Tabs, Text, VStack } from 'bako-ui';
import { useEffect, useMemo } from 'react';

import { useQueryParams, UseSocialSignIn } from '@/modules';
import { useContactToast } from '@/modules/addressBook/hooks';
import { useListConnectors } from '@/modules/core/hooks/fuel/useListConnectors';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useVerifyBrowserType } from '@/modules/dapp/hooks';
import { NetworkSignInDrawer } from '@/modules/network/components/signInDrawer';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import {
  UseDappSignIn,
  UseWalletSignIn,
  UseWebAuthnSignIn,
  UseWebSignIn,
  WebAuthnModeState,
} from '../hooks/signIn';
import { ConnectorsList } from './connector';
import { SigninContainer, SigninContainerMobile } from './container';
import { SignInFooter } from './footer';
import { SocialSignIn } from './social';
import { WebAuthnAccountCreated, WebAuthnSignIn } from './webAuthn';
import { LoadingCard } from './webAuthn/loading';

interface SignInWrapperProps {
  mode: WebAuthnModeState;
  setMode: (mode: WebAuthnModeState) => void;
  isAnyWalletConnectorOpen: UseWalletSignIn['isAnyWalletConnectorOpen'];
  tabs: UseWebAuthnSignIn['tabs'];
  formData: UseWebAuthnSignIn['formData'];
  formState: UseWebSignIn['formState'] | UseDappSignIn['formState'];
  accountsOptions: UseWebAuthnSignIn['accountsOptions'];
  inputBadge: UseWebAuthnSignIn['inputBadge'];
  createdAcccountUsername: UseWebAuthnSignIn['createdAcccountUsername'];
  handleInputChange: UseWebAuthnSignIn['handleInputChange'];
  handleSelectWallet: UseWalletSignIn['handleSelectWallet'];
  handleRegister: UseWebAuthnSignIn['handleRegister'];
  currentOpenConnector: UseWalletSignIn['currentOpenConnector'];
  handleSocialConnect: UseSocialSignIn['connect'];
  unableToConnectWithSocial: UseSocialSignIn['unableToConnect'];
}

const SignInWrapper = (props: SignInWrapperProps) => {
  const {
    isAnyWalletConnectorOpen,
    tabs,
    formData,
    formState,
    accountsOptions,
    inputBadge,
    createdAcccountUsername,
    mode,
    currentOpenConnector,
    unableToConnectWithSocial,
    handleInputChange,
    handleSelectWallet,
    handleRegister,
    handleSocialConnect,
    setMode,
  } = props;

  const { byConnector } = useQueryParams();
  const { isSafariBrowser } = useVerifyBrowserType();
  const { connectors } = useListConnectors();
  const { errorToast } = useContactToast();
  const {
    authDetails: auth,
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  const loginDrawer = useDisclosure();

  useEffect(() => {
    auth.invalidAccount &&
      errorToast({
        title: 'Invalid Account',
        description: 'You need to use the fuel wallet to connect.',
      });
    auth.handlers.setInvalidAccount?.(false);
  }, [auth.invalidAccount]);

  const isLoading = useMemo(
    () => formState.isLoading || isAnyWalletConnectorOpen,
    [formState.isLoading, isAnyWalletConnectorOpen],
  );
  const Root = isMobile ? SigninContainerMobile : SigninContainer;

  if (isSafariBrowser && byConnector) {
    return (
      <SigninContainerMobile>
        <VStack
          justifyContent="center"
          h="full"
          w="full"
          pt={20}
          pb={6}
          px={6}
          gap={14}
        >
          <VStack w="full" maxW={390} gap={6}>
            <Text textAlign="center">
              Safari is not yet supported on external connectors.
            </Text>
          </VStack>

          <SignInFooter />
        </VStack>
      </SigninContainerMobile>
    );
  }

  return (
    <Root>
      <NetworkSignInDrawer
        isOpen={loginDrawer.isOpen}
        onClose={loginDrawer.onClose}
      />

      <Tabs.Root
        value={tabs.tab.toString()}
        flex={1}
        w="full"
        display="flex"
        px={{ md: 4 }}
      >
        <Tabs.Content value="0" flex={1}>
          <Box h="full" p={0}>
            <VStack
              h="full"
              gap={20}
              alignItems="center"
              justifyContent="center"
            >
              {isLoading && (
                <Box maxW={{ md: 440, base: 'unset' }} w="full" spaceY={8}>
                  <LoadingCard
                    title={
                      isAnyWalletConnectorOpen
                        ? 'Connecting wallet...'
                        : mode === WebAuthnModeState.LOGIN
                          ? 'Logging in...'
                          : 'Creating new user...'
                    }
                    subtitle={
                      (isAnyWalletConnectorOpen && currentOpenConnector) ||
                      formData.form.getValues('username') ||
                      ''
                    }
                  />

                  {/* Show with hidden for prevent flick in the box */}
                  <SocialSignIn
                    hidden
                    onConnect={handleSocialConnect}
                    unableToConnect={unableToConnectWithSocial}
                  />

                  {/* Show with hidden for prevent flick in the box */}
                  <ConnectorsList
                    connectors={connectors}
                    hidden
                    onConnectorSelect={handleSelectWallet}
                    isAnyWalletConnectorOpen={isAnyWalletConnectorOpen}
                  />
                </Box>
              )}
              {!isLoading && (
                <VStack w="full" gap={8} maxW={{ md: 440, base: 'unset' }}>
                  <WebAuthnSignIn
                    formData={formData}
                    formState={formState}
                    accountsOptions={accountsOptions}
                    inputBadge={inputBadge}
                    handleInputChange={handleInputChange}
                    handleRegister={handleRegister}
                    onModeChange={setMode}
                  />

                  <SocialSignIn
                    onConnect={handleSocialConnect}
                    unableToConnect={unableToConnectWithSocial}
                  />

                  <ConnectorsList
                    connectors={connectors}
                    onConnectorSelect={handleSelectWallet}
                    isAnyWalletConnectorOpen={isAnyWalletConnectorOpen}
                  />
                </VStack>
              )}

              <SignInFooter />
            </VStack>
          </Box>
        </Tabs.Content>
        <Tabs.Content value="1" flex={1} display="flex" justifyContent="center">
          <Box
            h="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="full"
            maxW={{ md: 440 }}
          >
            <WebAuthnAccountCreated
              username={createdAcccountUsername}
              formState={formState}
            />

            <SignInFooter />
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </Root>
  );
};

export { SignInWrapper };
