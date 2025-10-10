import { Button, DialogOpenChangeDetails, VStack } from '@chakra-ui/react';

import { useNetworks } from '@/modules/network/hooks';
import { NetworkType } from '@/modules/network/services';
import { useUpdateSettingsRequest } from '@/modules/settings/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { Dialog } from '../dialog';
import { BridgeIcon, CoinsIcon, DownLeftArrow } from '../icons';
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
    screenSizes: {
      isMobile,
      isSmall,
      isLitteSmall,
      isLowerThanFourHundredAndThirty,
    },
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
      closeOnInteractOutside={false}
      size={{ base: 'full', sm: 'lg' }}
      modalContentProps={{
        px: 10,
        py: 10,
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
          titleSxProps={{
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: '19.36px',
          }}
          borderBottomWidth={1}
          borderColor="grey.425"
          pb={6}
        />

        <VStack w="full" my={6} pb={isMobile ? 8 : 0} gap={4}>
          <WelcomeCard
            title="Deposit"
            description="Deposit using QR Code or vault adress."
            icon={DownLeftArrow}
            iconSize="22px"
            onClick={() => handleOpenDepositDialog()}
          />
          <WelcomeCard
            title="Bridge"
            description="Transfer between different networks."
            icon={BridgeIcon}
            commingSoon={isTestnet}
            onClick={isTestnet ? undefined : () => handleRedirectToMainNet()}
          />
          <WelcomeCard
            title="Purchase"
            description="Buy crypto using card or bank account."
            icon={CoinsIcon}
            commingSoon
            iconSize="22px"
          />
        </VStack>

        <Dialog.Actions
          position={isMobile ? 'absolute' : 'relative'}
          bottom={0}
          left={0}
          right={0}
          px={isMobile ? 10 : 'unset'}
          bg={isMobile ? 'dark.950' : 'unset'}
          borderRadius={isMobile && !isSmall ? '20px' : 'unset'}
          pb={isMobile && !isSmall ? 5 : 'unset'}
          css={{
            '&>hr': {
              marginTop: '0',
              borderColor: '#868079',
            },
          }}
        >
          <Button
            fontSize={isLitteSmall ? '12px' : '14px'}
            lineHeight="15.85px"
            fontWeight="normal"
            letterSpacing={isLowerThanFourHundredAndThirty ? 0 : '.5px'}
            variant="outline"
            color="grey.75"
            borderColor="grey.75"
            w="full"
            _hover={{
              bg: '#f5f5f513',
            }}
            onClick={() => handleClose()}
          >
            Skip this step and take a look into bako
          </Button>
        </Dialog.Actions>
      </Dialog.Body>
    </Dialog.Modal>
  );
};

export default WelcomeDialog;
