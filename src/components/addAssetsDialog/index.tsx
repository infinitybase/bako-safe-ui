import { Button, DialogOpenChangeDetails, VStack } from 'bako-ui';

import { useUpdateSettingsRequest } from '@/modules/settings/hooks';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { Dialog } from '../dialog';
import { BridgeIcon, CoinsIcon, DownLeftArrow2 } from '../icons';
import WelcomeCard from '../welcomeDialog/card';

interface IWelcomeDialogProps {
  isOpen: boolean;
  onOpenChange: (value: DialogOpenChangeDetails) => void;
  setIsDepositDialogOpen: (value: boolean) => void;
}

const AddAssetsDialog = ({
  isOpen,
  setIsDepositDialogOpen,
  onOpenChange,
}: IWelcomeDialogProps) => {
  const {
    screenSizes: { isMobile, isLitteSmall, isLowerThanFourHundredAndThirty },
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
      open={isOpen}
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
          title="Add your assets"
          description={`Select your preferred method for adding funds to your personal vault.`}
          descriptionFontSize="12px"
          descriptionColor="textSecondary"
          titleSxProps={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'textPrimary',
            lineHeight: '100%',
          }}
          borderBottomWidth={1}
          borderColor="grey.425"
          pb={6}
        />

        <VStack w="full" my={6} pb={isMobile ? 8 : 0} gap={4}>
          <WelcomeCard
            title="DEPOSIT"
            description="Deposit using QR Code or vault adress."
            icon={DownLeftArrow2}
            iconSize="18px"
            onClick={() => handleOpenDepositDialog()}
          />
          <WelcomeCard
            title="BRIDGE"
            description="Transfer between different networks."
            iconSize="22px"
            icon={BridgeIcon}
            onClick={() => handleRedirectToMainNet()}
          />
          <WelcomeCard
            title="PURCHASE"
            description="Buy crypto using card or bank account."
            icon={CoinsIcon}
            commingSoon
            iconSize="22px"
          />
        </VStack>

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
