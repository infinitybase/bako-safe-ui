import {
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useEffect } from 'react';

import { useContactToast } from '@/modules/addressBook/hooks';
import { useListConnectors } from '@/modules/core/hooks/fuel/useListConnectors';
import { useVerifyBrowserType } from '@/modules/dapp/hooks';
import { NetworkSignInDrawer } from '@/modules/network/components/signInDrawer';
import { useNetworks } from '@/modules/network/hooks';
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

  const { isSafariBrowser } = useVerifyBrowserType();
  const { connectors } = useListConnectors();
  const { errorToast } = useContactToast();
  const {
    authDetails: auth,
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  const { fromConnector } = useNetworks();

  const loginDrawer = useDisclosure();

  useEffect(() => {
    auth.invalidAccount &&
      errorToast({
        title: 'Invalid Account',
        description: 'You need to use the fuel wallet to connect.',
      });
    auth.handlers.setInvalidAccount?.(false);
  }, [auth.invalidAccount]);

  useEffect(() => {
    if (fromConnector) {
      loginDrawer.onOpen?.();
    }
  }, []);

  if (isMobile) {
    return (
      <SigninContainerMobile>
        <NetworkSignInDrawer
          isOpen={loginDrawer.isOpen}
          onClose={loginDrawer.onClose}
        />

        <Tabs index={tabs.tab} flex={1} w="full" display="flex">
          <TabPanels flex={1}>
            <TabPanel h="full" p={0}>
              <VStack
                justifyContent="center"
                h="full"
                w="full"
                pt={20}
                pb={6}
                px={6}
                spacing={14}
              >
                <SignInHeader
                  title={title}
                  showDescription={mode !== WebAuthnModeState.ACCOUNT_CREATED}
                />

                <VStack w="full" maxW={390} spacing={6}>
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
            </TabPanel>

            <TabPanel h="full">
              <WebAuthnAccountCreated
                title={createdAcccountUsername}
                formState={formState}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SigninContainerMobile>
    );
  }

  return (
    <SigninContainer>
      <NetworkSignInDrawer
        isOpen={loginDrawer.isOpen}
        onClose={loginDrawer.onClose}
      />

      <Tabs index={tabs.tab} flex={1} w="full">
        <TabPanels h="full">
          <TabPanel h="full" p={0}>
            <VStack
              h="full"
              spacing={20}
              alignItems="center"
              justifyContent="center"
            >
              <SignInHeader
                title={title}
                showDescription={mode !== WebAuthnModeState.ACCOUNT_CREATED}
              />

              <VStack w="full" spacing={8} maxW={390}>
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
          </TabPanel>

          <TabPanel h="full">
            <WebAuthnAccountCreated
              title={createdAcccountUsername}
              formState={formState}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </SigninContainer>
  );
};

export { SignInWrapper };
