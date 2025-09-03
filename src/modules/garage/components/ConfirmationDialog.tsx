import { Dialog } from '@/components';

type ConfirmationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  confirmAction: () => void;
  confirmText: string;
  description: string;
  title: string;
  isLoading?: boolean;
};

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  confirmAction,
  confirmText,
  description,
  title,
  isLoading,
}: ConfirmationDialogProps) => {
  return (
    <Dialog.Modal
      id="delist-nft-dialog"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      size={{
        base: 'full',
        sm: 'lg',
      }}
    >
      <Dialog.Header
        title={title}
        onClose={onClose}
        description={description}
        hidden={false}
        titleSxProps={{ fontSize: 'xl' }}
        descriptionColor="grey.425"
        descriptionFontSize="sm"
        mb={0}
        mt={{ base: 4, xs: 0 }}
      />

      <Dialog.Actions
        w="full"
        dividerBorderColor="grey.425"
        position="relative"
        hideDivider
        mt={6}
        buttonSpacing={3}
      >
        <Dialog.SecondaryAction
          onClick={onClose}
          w="full"
          isDisabled={isLoading}
        >
          Cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          w="full"
          hidden={false}
          bg="error.600"
          onClick={confirmAction}
          isLoading={isLoading}
          _hover={{
            opacity: 0.8,
            borderColor: 'error.600',
          }}
        >
          {confirmText}
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};
