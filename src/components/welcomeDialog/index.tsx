import { Button, DialogOpenChangeDetails, Flex, Stack } from 'bako-ui';

import { useNetworks } from '@/modules/network/hooks';
import { NetworkType } from '@/modules/network/services';
import { useUpdateSettingsRequest } from '@/modules/settings/hooks';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { Dialog } from '../dialog';
import { BridgeIcon, CoinsIcon, DownLeftArrow2 } from '../icons';
import WelcomeCard from './card';
import { WelcomeHeader } from './header';
import { WelcomeRoot } from './root';

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
    screenSizes: { isSmall },
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
    <WelcomeRoot
      onOpenChange={onOpenChange}
      open={(first_login && first_login && isOpen) ?? false}
      isMobile={isSmall}
    >
      <Dialog.Body>
        <WelcomeHeader
          onClose={() => handleClose()}
          title="Welcome to Bako Safe!"
          subtitle="Let's start by adding some funds to your personal vault."
          isMobile={isSmall}
        />

        <Stack
          w="full"
          my={{ sm: 3 }}
          gap={4}
          flexDir={{ base: 'column', sm: 'row' }}
          px={{ base: 6, sm: 0 }}
        >
          <WelcomeCard
            title="Bridge"
            description="Crypto from Ethereum network to Fuel mainnet."
            icon={BridgeIcon}
            commingSoon={isTestnet}
            onClick={isTestnet ? undefined : () => handleRedirectToMainNet()}
            isMobile={isSmall}
          />
          <WelcomeCard
            title="Deposit"
            description="Deposit using QR Code or vault address"
            icon={DownLeftArrow2}
            iconSize="22px"
            onClick={handleOpenDepositDialog}
            isMobile={isSmall}
          />
          <WelcomeCard
            title="Purchase"
            description="Buy crypto using card or bank account."
            icon={CoinsIcon}
            commingSoon
            iconSize="22px"
            isMobile={isSmall}
          />
        </Stack>
        <Dialog.Actions justifyContent="flex-end" p={{ base: 6, sm: 0 }}>
          <Flex w="full" justifyContent="flex-end">
            <Button variant="ghost" onClick={handleClose}>
              Skip
            </Button>
          </Flex>
        </Dialog.Actions>
      </Dialog.Body>
    </WelcomeRoot>
  );
};

export default WelcomeDialog;
