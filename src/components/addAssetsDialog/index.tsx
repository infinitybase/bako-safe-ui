import { Button, VStack } from '@chakra-ui/react';

import { useUpdateSettingsRequest } from '@/modules/settings/hooks';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { Dialog } from '../dialog';
import { BridgeIcon, CoinsIcon, DownLeftArrow } from '../icons';
import WelcomeCard from '../welcomeDialog/card';

interface IWelcomeDialogProps {
  isOpen: boolean;
  setIsAddAssetDialogOpen: (value: boolean) => void;
  setIsDepositDialogOpen: (value: boolean) => void;
}

const AddAssetsDialog = ({
  isOpen,
  setIsDepositDialogOpen,
  setIsAddAssetDialogOpen,
}: IWelcomeDialogProps) => {
  const {
    screenSizes: {
      isMobile,
      screenWidths: { isSmallerThan600, isSmallerThan430, isSmallerThan400 },
    },
    authDetails: {
      userInfos: { id, refetch },
    },
  } = useWorkspaceContext();

  const updateUserMutation = useUpdateSettingsRequest();

  const handleUpdateUser = async () => {
    updateUserMutation.mutate(
      { id, first_login: false },
      { onSuccess: () => refetch() },
    );
  };

  const handleOpenDepositDialog = () => {
    handleUpdateUser();
    setIsDepositDialogOpen(true);
    setIsAddAssetDialogOpen(false);
  };

  const handleClose = () => {
    handleUpdateUser();
    setIsAddAssetDialogOpen(false);
  };

  const handleRedirectToMainNet = async () => {
    window.open(import.meta.env.VITE_BRIDGE, '_BLANK');
  };

  return (
    <Dialog.Modal
      onClose={() => handleClose()}
      isOpen={isOpen}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      size={{ base: 'full', xs: 'lg' }}
      blockScrollOnMount={false}
    >
      <Dialog.Body>
        <Dialog.Header
          mt={0}
          mb={0}
          onClose={() => handleClose()}
          w="full"
          maxW={{ base: 480, xs: 'unset' }}
          title="Add your assets"
          description={`Select your preferred method for adding funds to your personal vault.`}
          borderBottomWidth={1}
          borderColor="grey.425"
          pb={6}
        />

        <VStack w="full" my={6} pb={isMobile ? 8 : 0} spacing={4}>
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
            onClick={() => handleRedirectToMainNet()}
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
          borderRadius={isMobile && !isSmallerThan600 ? '20px' : 'unset'}
          pb={isMobile && !isSmallerThan600 ? 5 : 'unset'}
          sx={{
            '&>hr': {
              marginTop: '0',
              borderColor: '#868079',
            },
          }}
        >
          <Button
            fontSize={isSmallerThan400 ? '12px' : '14px'}
            lineHeight="15.85px"
            fontWeight="normal"
            letterSpacing={isSmallerThan430 ? 0 : '.5px'}
            variant="outline"
            color="grey.75"
            borderColor="grey.75"
            w="full"
            _hover={{ bg: '#f5f5f513' }}
            onClick={() => handleClose()}
          >
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog.Body>
    </Dialog.Modal>
  );
};

export default AddAssetsDialog;
