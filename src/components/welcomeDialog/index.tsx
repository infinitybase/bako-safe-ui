import { Button, DialogOpenChangeDetails, Flex, HStack } from 'bako-ui';

import { useNetworks } from '@/modules/network/hooks';
import { NetworkType } from '@/modules/network/services';
import { useUpdateSettingsRequest } from '@/modules/settings/hooks';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { Dialog } from '../dialog';
import { BridgeIcon, CoinsIcon, DownLeftArrow2 } from '../icons';
import WelcomeCard from './card';

interface IWelcomeDialogProps {
  isOpen: boolean;
  onOpenChange: (value: DialogOpenChangeDetails) => void;
  setIsDepositDialogOpen: (value: boolean) => void;
}

const WelcomeDialog = ({
  isOpen,
  setIsDepositDialogOpen,
  onOpenChange,
}: IWelcomeDialogProps) => {
  const {
    screenSizes: { isMobile, isSmall },
    authDetails: {
      userInfos: { first_login, id, refetch },
    },
  } = useWorkspaceContext();

  const updateUserMutation = useUpdateSettingsRequest();

  const { checkNetwork } = useNetworks();
  const isTestnet = checkNetwork(NetworkType.TESTNET);

  const handleUpdateUser = async () => {
    updateUserMutation.mutate(
      {
        id,
        first_login: false,
      },
      {
        onSuccess: () => refetch(),
      },
    );
  };

  const handleOpenDepositDialog = () => {
    handleUpdateUser();
    setIsDepositDialogOpen(true);
    onOpenChange({ open: false });
  };

  const handleClose = () => {
    handleUpdateUser();
    onOpenChange({ open: false });
  };

  const handleRedirectToMainNet = async () => {
    window.open(import.meta.env.VITE_BRIDGE, '_BLANK');
  };

  return (
    <Dialog.Modal
      onOpenChange={onOpenChange}
      open={(first_login && first_login && isOpen) ?? false}
      closeOnEscape={false}
      trapFocus={false}
      closeOnInteractOutside={false}
      size={{ base: 'full', sm: 'lg' }}
      modalContentProps={{
        px: 6,
        py: 6,
      }}
    >
      <Dialog.Body>
        <Dialog.Header
          mt={0}
          mb={0}
          onClose={() => handleClose()}
          w="full"
          maxW={{ base: 480, sm: 'unset' }}
          title="Welcome to Bako Safe!"
          description={`Let's start by adding some funds to your personal vault.`}
          descriptionFontSize="12px"
          descriptionColor="textSecondary"
          titleSxProps={{
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: '19.36px',
          }}
          pb={3}
        />

        <HStack w="full" my={3} gap={4}>
          <WelcomeCard
            title="Bridge"
            description="Crypto from Ethereum network to Fuel mainnet."
            icon={BridgeIcon}
            commingSoon={isTestnet}
            onClick={isTestnet ? undefined : () => handleRedirectToMainNet()}
          />
          <WelcomeCard
            title="Deposit"
            description="Deposit using QR Code or vault address"
            icon={DownLeftArrow2}
            iconSize="22px"
            onClick={handleOpenDepositDialog}
          />
          <WelcomeCard
            title="Purchase"
            description="Buy crypto using card or bank account."
            icon={CoinsIcon}
            commingSoon
            iconSize="22px"
          />
        </HStack>
        <Dialog.Actions
          position={isMobile ? 'absolute' : 'relative'}
          bottom={0}
          left={0}
          right={0}
          px={isMobile ? 10 : 'unset'}
          bg={isMobile ? 'dark.950' : 'unset'}
          borderRadius={isMobile && !isSmall ? '20px' : 'unset'}
          pb={isMobile && !isSmall ? 5 : 'unset'}
          hideDivider
          justifyContent="flex-end"
        >
          <Flex w="full" justifyContent="flex-end">
            <Button variant="ghost" onClick={handleClose}>
              Skip
            </Button>
          </Flex>
        </Dialog.Actions>
      </Dialog.Body>
    </Dialog.Modal>
  );
};

export default WelcomeDialog;
