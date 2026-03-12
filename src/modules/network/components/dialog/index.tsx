import { Button, RhfInput, VStack } from 'bako-ui';
import { memo } from 'react';

import { CloseCircle, Dialog, DialogModalProps } from '@/components';

import { ConnectionStatus, useNetworks } from '../../hooks';

interface NetworkDialogProps extends Omit<DialogModalProps, 'children'> {}

const NetworkDialog = memo(({ ...props }: NetworkDialogProps) => {
  const {
    handleAddNetwork,
    networkForm,
    handleCheckNetwork,
    validNetwork,
    connectionStatus,
    handleClose,
    checkNetworkRequest: { isPending: loadingCheck },
    urlFormValue,
    handleClearUrl,
  } = useNetworks(() => props.onOpenChange?.({ open: false }));

  return (
    <Dialog.Modal
      size={{ base: 'full', sm: 'md' }}
      open={props.open}
      closeOnInteractOutside={false}
      onOpenChange={props.onOpenChange}
      trapFocus={false}
      modalContentProps={{ py: 6, px: 0 }}
      modalBodyProps={{ gap: 6 }}
    >
      <Dialog.Header
        position="relative"
        onClose={handleClose}
        title="New Network"
        description="Define the name and URL of the new network."
        titleSxProps={{
          color: 'textPrimary',
          fontSize: 'sm',
          lineHeight: 'shorter',
        }}
        descriptionColor="textSecondary"
        descriptionFontSize="12px"
        mt={0}
        mb={0}
        px={6}
      />

      <Dialog.Body px={6}>
        <VStack gap={4} w="full">
          <RhfInput
            name="name"
            control={networkForm.control}
            defaultValue=""
            slotProps={{
              input: {
                placeholder: 'Name',
                padding: 3,
                variant: 'subtle',
                disabled: true,
              },
            }}
            error={networkForm.formState.errors.name}
          />

          <RhfInput
            name="url"
            control={networkForm.control}
            defaultValue=""
            rules={{ required: 'URL is required' }}
            slotProps={{
              input: {
                placeholder: 'URL',
                padding: 3,
                variant: 'subtle',
              },
              inputGroup: {
                endElement: urlFormValue && (
                  <CloseCircle
                    boxSize={4}
                    color="gray.200"
                    cursor="pointer"
                    onClick={handleClearUrl}
                  />
                ),
              },
            }}
            error={networkForm.formState.errors.url}
          />

          <Button
            w="full"
            variant="outline"
            color={
              connectionStatus === ConnectionStatus.FAILED
                ? 'red.200'
                : 'textSecondary'
            }
            fontWeight="normal"
            borderColor="secondary.main"
            onClick={handleCheckNetwork}
            _hover={{
              borderColor: 'inherit',
              color:
                connectionStatus === ConnectionStatus.FAILED
                  ? 'red.100'
                  : 'inherit',
            }}
            css={{ _active: { bg: 'inherit' } }}
            disabled={loadingCheck || !urlFormValue}
          >
            {loadingCheck
              ? 'Testing connection...'
              : connectionStatus === ConnectionStatus.FAILED
                ? 'Connection failed!'
                : connectionStatus === ConnectionStatus.SUCCESS
                  ? 'Connection successful!'
                  : 'Test connection'}
          </Button>
        </VStack>
      </Dialog.Body>

      <Dialog.Actions mt="auto" px={6}>
        <Dialog.SecondaryAction onClick={handleClose}>
          Cancel
        </Dialog.SecondaryAction>

        <Dialog.PrimaryAction
          w="auto"
          flex={1}
          onClick={handleAddNetwork}
          disabled={!validNetwork}
        >
          Add
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
});

NetworkDialog.displayName = 'NetworkDialog';

export { NetworkDialog };
