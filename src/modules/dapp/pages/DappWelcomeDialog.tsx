import { Button, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BridgeIcon, CoinsIcon, Dialog, DownLeftArrow } from '@/components';
import DepositDialog from '@/components/depositDialog';
import WelcomeCard from '@/components/welcomeDialog/card';
import { Pages } from '@/modules/core/routes';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

const DappWelcomeDialog = () => {
  const [isWelcomeDialogOpen, setIsWelcomeDialogOpen] = useState(true);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);

  const {
    screenSizes: {
      isMobile,
      isSmall,
      // isLitteSmall,
      // isLowerThanFourHundredAndThirty,
    },
    // authDetails: {
    //   userInfos: {
    //     // first_login,
    //     // id,
    //     // refetch,
    //   },
    // },
    userVaults: {
      request: { vaults },
    },
  } = useWorkspaceContext();

  // const updateUserMutation = useUpdateSettingsRequest();
  const navigate = useNavigate();

  const handleUpdateUser = async () => {
    //   updateUserMutation.mutate(
    //     { id, first_login: false },
    //     { onSuccess: () => refetch() },
    //   );
  };

  const handleOpenDepositDialog = () => {
    handleUpdateUser();
    setIsDepositDialogOpen(true);
    setIsWelcomeDialogOpen(false);
  };

  const handleRedirectToMainNet = async () => {
    window.open(import.meta.env.VITE_BRIDGE, '_BLANK');
  };

  return (
    <>
      <DepositDialog
        isOpen={isDepositDialogOpen}
        setIsDepositDialogOpen={setIsDepositDialogOpen}
        setIsWelcomeDialogOpen={setIsWelcomeDialogOpen}
        vault={vaults[0]}
        description="This is the address of your Safe Account. Deposit funds by scanning the QR code or copying the address below. Only send XDAI and tokens (e.g. ERC20, ERC721) to this address."
      />

      {/* WELCOME DIALOG */}
      <Dialog.Modal
        onClose={() => 'ok'}
        // onClose={() => handleClose()}
        isOpen={isWelcomeDialogOpen}
        // isOpen={(first_login && first_login && isOpen) ?? false}
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
              // onClick={isTestnet ? undefined : () => handleRedirectToMainNet()}
              // TODO: Confirm what to do when mainnet
              // TODO: Confirm if window should close after redirect
              onClick={() => handleRedirectToMainNet()}
            />
            <WelcomeCard
              title="Bridge on Orbiter Finance"
              description="Transfer crypto from other chains to Fuel mainnet."
              icon={BridgeIcon}
              commingSoon={true}
              // onClick={isTestnet ? undefined : () => handleRedirectToMainNet()}
            />
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
              // onClick={() => handleOpenDepositDialog()}
            />
          </VStack>

          <Dialog.Actions
            position={isMobile ? 'absolute' : 'relative'}
            bottom={10}
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
                navigate(`${Pages.dappAuth()}${location.search}`);
                window.open(`${window.location.origin}/home`, '_BLANK');
              }}
            >
              Manage your Bako Safe
            </Button>
          </Dialog.Actions>
        </Dialog.Body>
      </Dialog.Modal>
    </>
  );
};

export { DappWelcomeDialog };
