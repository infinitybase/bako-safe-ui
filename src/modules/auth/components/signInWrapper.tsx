import { Box, Tabs, Text, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';

import { useQueryParams } from '@/modules';
import { useContactToast } from '@/modules/addressBook/hooks';
import { useListConnectors } from '@/modules/core/hooks/fuel/useListConnectors';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useVerifyBrowserType } from '@/modules/dapp/hooks';
import { NetworkSignInDrawer } from '@/modules/network/components/signInDrawer';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

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
import { SignInHeader } from './header';
import { WebAuthnAccountCreated, WebAuthnSignIn } from './webAuthn';

interface SignInWrapperProps {
  mode: WebAuthnModeState;
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
}

const title = 'Welcome to Bako Safe';

const SignInWrapper = (props: SignInWrapperProps) => {
  const {
    isAnyWalletConnectorOpen,
    tabs,
    formData,
    formState,
    accountsOptions,
    inputBadge,
    createdAcccountUsername,
    handleInputChange,
    handleSelectWallet,
    handleRegister,
    mode,
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
          <SignInHeader title={title} showDescription={false} />

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

  if (isMobile) {
    return (
      <SigninContainerMobile>
        <NetworkSignInDrawer
          isOpen={loginDrawer.isOpen}
          onClose={loginDrawer.onClose}
        />

        <Tabs.Root value={tabs.tab.toString()} flex={1} w="full" display="flex">
          <Tabs.List>
            <Box h="full" p={0}>
              <VStack
                justifyContent="center"
                h="full"
                w="full"
                pt={20}
                pb={6}
                px={6}
                gap={14}
              >
                <SignInHeader
                  title={title}
                  showDescription={mode !== WebAuthnModeState.ACCOUNT_CREATED}
                />

                <VStack w="full" maxW={390} gap={6}>
                  <WebAuthnSignIn
                    formData={formData}
                    formState={formState}
                    accountsOptions={accountsOptions}
                    inputBadge={inputBadge}
                    handleInputChange={handleInputChange}
                    handleRegister={handleRegister}
                  />

                  <ConnectorsList
                    connectors={connectors}
                    hidden={isSafariBrowser}
                    onConnectorSelect={handleSelectWallet}
                    isAnyWalletConnectorOpen={isAnyWalletConnectorOpen}
                  />
                </VStack>

                <SignInFooter />
              </VStack>
            </Box>

            <Box h="full">
              <WebAuthnAccountCreated
                showDescription={mode !== WebAuthnModeState.ACCOUNT_CREATED}
                title={createdAcccountUsername}
                formState={formState}
              />
            </Box>
          </Tabs.List>
        </Tabs.Root>
      </SigninContainerMobile>
    );
  }

  return (
    <SigninContainer>
      <NetworkSignInDrawer
        isOpen={loginDrawer.isOpen}
        onClose={loginDrawer.onClose}
      />

      <Tabs.Root value={tabs.tab.toString()} flex={1} w="full">
        <Box h="full">
          <Box h="full" p={0}>
            <VStack
              h="full"
              gap={20}
              alignItems="center"
              justifyContent="center"
            >
              <SignInHeader
                title={title}
                showDescription={mode !== WebAuthnModeState.ACCOUNT_CREATED}
              />

              <VStack w="full" gap={8} maxW={390}>
                <WebAuthnSignIn
                  formData={formData}
                  formState={formState}
                  accountsOptions={accountsOptions}
                  inputBadge={inputBadge}
                  handleInputChange={handleInputChange}
                  handleRegister={handleRegister}
                />

                <ConnectorsList
                  connectors={connectors}
                  hidden={isSafariBrowser}
                  onConnectorSelect={handleSelectWallet}
                  isAnyWalletConnectorOpen={isAnyWalletConnectorOpen}
                />
              </VStack>

              <SignInFooter />
            </VStack>
          </Box>

          <Box h="full">
            <WebAuthnAccountCreated
              title={createdAcccountUsername}
              formState={formState}
              showDescription={mode !== WebAuthnModeState.ACCOUNT_CREATED}
            />
          </Box>
        </Box>
      </Tabs.Root>
    </SigninContainer>
  );
};

export { SignInWrapper };
