import { Button, DialogOpenChangeDetails, Flex, Stack } from 'bako-ui';

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
          title="Welcome to Bako Safe!"
          description={`Let's start by adding some funds to your personal vault.`}
          descriptionFontSize="12px"
          descriptionColor="textSecondary"
          titleSxProps={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'textPrimary',
            lineHeight: '100%',
          }}
          pb={3}
        />

        <Stack
          flexDirection={{ base: 'column', sm: 'row' }}
          w="full"
          mt={3}
          mb={6}
          gap={4}
        >
          <WelcomeCard
            title="BRIDGE"
            description="Crypto from Ethereum network to Fuel mainnet."
            icon={BridgeIcon}
            iconSize="18px"
            commingSoon={isTestnet}
            onClick={isTestnet ? undefined : () => handleRedirectToMainNet()}
          />
          <WelcomeCard
            title="DEPOSIT"
            description="Deposit using QR Code or vault address"
            icon={DownLeftArrow2}
            iconSize="22px"
            onClick={handleOpenDepositDialog}
          />
          <WelcomeCard
            title="PURCHASE"
            description="Buy crypto using card or bank account."
            icon={CoinsIcon}
            commingSoon
            iconSize="22px"
          />
        </Stack>
        <Dialog.Actions
          position={{ base: 'absolute', sm: 'relative' }}
          bottom={0}
          left={0}
          right={0}
          px={{ base: 10, sm: 'unset' }}
          bg={{ base: 'dark.950', sm: 'unset' }}
          borderRadius={{ base: 20, sm: 'unset' }}
          pb={{ base: 5, sm: 'unset' }}
          hideDivider
          justifyContent="flex-end"
        >
          <Flex w="full" justifyContent="flex-end">
            <Button
              variant="ghost"
              onClick={handleClose}
              fontWeight="normal"
              color="gray.300"
              _hover={{
                color: 'textPrimary',
              }}
            >
              Skip
            </Button>
          </Flex>
        </Dialog.Actions>
      </Dialog.Body>
    </Dialog.Modal>
  );
};

export default WelcomeDialog;
