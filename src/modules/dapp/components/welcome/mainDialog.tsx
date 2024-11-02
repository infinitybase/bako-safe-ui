import { Button, VStack } from '@chakra-ui/react';

import { BridgeIcon, CoinsIcon, Dialog, DownLeftArrow } from '@/components';
import WelcomeCard from '@/components/welcomeDialog/card';
import { NetworkType } from '@/modules/network/services';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

type WelcomeDialogDappProps = {
  isWelcomeDialogOpen: boolean;
  setIsDepositDialogOpen: (value: boolean) => void;
  setIsWelcomeDialogOpen: (value: boolean) => void;
};

const WelcomeDialogDapp = ({
  isWelcomeDialogOpen,
  setIsDepositDialogOpen,
  setIsWelcomeDialogOpen,
}: WelcomeDialogDappProps) => {
  const {
    screenSizes: { isMobile, isSmall },
    checkNetwork,
  } = useWorkspaceContext();

  const isTestnet = checkNetwork(NetworkType.TESTNET);

  const handleRedirectToMainNet = async () => {
    window.open(import.meta.env.VITE_BRIDGE, '_BLANK');
  };

  const handleOpenDepositDialog = () => {
    setIsDepositDialogOpen(true);
    setIsWelcomeDialogOpen(false);
  };

  return (
    <Dialog.Modal
      onClose={() => {}}
      isOpen={isWelcomeDialogOpen}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      size={{ base: 'full', xs: 'lg' }}
      modalContentProps={{ px: 10, py: 10 }}
    >
      <Dialog.Body>
        <Dialog.Header
          mt={0}
          mb={0}
          w="full"
          maxW={{ base: 480, xs: 'unset' }}
          title="Welcome to Bako Safe!"
          description={`Let's start by adding some funds to your personal vault.`}
          descriptionFontSize={'12px'}
          titleSxProps={{
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: '19.36px',
          }}
          borderBottomWidth={1}
          borderColor="grey.425"
          hideCloseButton={true}
        />

        <VStack w="full" my={6} pb={isMobile ? 8 : 0} spacing={4}>
          <WelcomeCard
            title="Bridge on Fuel Bridge"
            description="Transfer crypto from ETH to Fuel mainnet."
            icon={BridgeIcon}
            onClick={isTestnet ? undefined : () => handleRedirectToMainNet()}
            commingSoon={isTestnet}
          />
          {/* <WelcomeCard
          title="Bridge on Orbiter Finance"
          description="Transfer crypto from other chains to Fuel mainnet."
          icon={BridgeIcon}
          commingSoon={true}
          // onClick={isTestnet ? undefined : () => handleRedirectToMainNet()}
        /> */}
          <WelcomeCard
            title="Deposit"
            description="Deposit crypto using QR Code or vault address (Fuel only)."
            icon={DownLeftArrow}
            iconSize="22px"
            onClick={() => handleOpenDepositDialog()}
          />
          <WelcomeCard
            title="Purchase"
            description="Buy crypto using card or bank account."
            icon={CoinsIcon}
            iconSize="22px"
            commingSoon
          />
        </VStack>

        <Dialog.Actions
          position={isMobile ? 'absolute' : 'relative'}
          bottom={isMobile ? 10 : 0}
          left={0}
          right={0}
          px={isMobile ? 10 : 'unset'}
          bg={isMobile ? 'dark.950' : 'unset'}
          borderRadius={isMobile && !isSmall ? '20px' : 'unset'}
          pb={isMobile && !isSmall ? 5 : 'unset'}
          sx={{
            '&>hr': {
              marginTop: '0',
              borderColor: '#868079',
            },
          }}
        >
          <Button
            w="full"
            variant="primary"
            _hover={{ opacity: 0.8 }}
            fontWeight={600}
            fontSize={14}
            onClick={() => {
              window.open(`${window.location.origin}/home`, '_BLANK');
            }}
            mt={2}
          >
            Manage your Bako Safe
          </Button>
        </Dialog.Actions>
      </Dialog.Body>
    </Dialog.Modal>
  );
};

export { WelcomeDialogDapp };
