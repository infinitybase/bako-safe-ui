import { HStack, Text, VStack } from 'bako-ui';
import { memo } from 'react';

import {
  Dialog,
  DialogModalProps,
  SquarePlusIcon,
  Tooltip,
} from '@/components';
import { useVerifyBrowserType } from '@/modules/dapp/hooks';
import { TabState, useCreateVaultDialog } from '@/modules/vault/hooks';

import CreateVaultWarning from '../../CreateVaultWarning';
import { CreateVaultForm } from './form';

interface CreateVaultDialogProps extends Omit<DialogModalProps, 'children'> {
  onCreate?: () => void;
}

const CreateVaultDialog = memo((props: CreateVaultDialogProps) => {
  const {
    tabs,
    form,
    addresses,
    onDeposit,
    steps,
    bakoSafeVault,
    handleCancel,
    selectedTemplate,
    setFormWithTemplate,
    onSaveTemplate,
    handleInputChange,
    vaultNameIsAvailable,
    search,
    setSearch,
    validateAddress,
  } = useCreateVaultDialog({
    onOpenChange: (payload) => props.onOpenChange?.(payload),
    onCreate: props.onCreate,
  });

  const { isSafariBrowser, isMobile } = useVerifyBrowserType();

  const isFirstTab = tabs.tab === 0;
  const isSecondTab = tabs.tab === 1;

  const isSecondTabAndMobile = isSecondTab && isMobile;

  return (
    <Dialog.Modal
      size={{ base: 'full', md: 'md' }}
      {...props}
      closeOnInteractOutside={false}
      modalContentProps={{
        maxH: '100vh',
      }}
      modalBodyProps={{
        maxH: '100vh',
      }}
    >
      <Dialog.Header
        hideCloseButton={isSafariBrowser && isMobile}
        onClose={handleCancel}
        maxW={450}
        mb={0}
        pt={isSafariBrowser && isMobile ? 6 : 'unset'}
        hidden={steps.step?.hide}
        title="Create new Account"
        description={steps.step?.description ?? ''}
        descriptionFontSize="sm"
      />

      <Dialog.Body
        maxW={450}
        mb={isFirstTab ? 8 : 0}
        maxH={isFirstTab ? '60vh' : 700}
        minH={!isFirstTab ? 'fit-content' : 'unset'}
      >
        <CreateVaultForm
          tabs={tabs}
          form={form}
          steps={steps}
          onCancel={handleCancel}
          onDeposit={onDeposit}
          addresses={addresses}
          selectedTemplate={selectedTemplate}
          setTemplate={setFormWithTemplate}
          onSaveTemplate={onSaveTemplate}
          vaultNameIsAvailable={vaultNameIsAvailable}
          search={search}
          setSearch={setSearch}
          handleInputChange={handleInputChange}
          validateAddress={validateAddress}
        />
      </Dialog.Body>

      <Dialog.Actions
        w="full"
        maxW={450}
        mt={isSecondTab ? 'unset' : 'auto'}
        css={{
          '&>hr': {
            mt: 0,
            mb: isSecondTab ? 0 : 8,
            display: tabs.tab === 2 ? 'none' : 'block',
          },
        }}
        bgColor="dark.950"
        position={isSecondTabAndMobile ? 'absolute' : 'unset'}
        bottom={0}
        px={isSecondTabAndMobile ? 6 : 'unset'}
      >
        <VStack w="full" alignItems="center" bg="dark.950" zIndex={999}>
          {isSecondTab && (
            <HStack my={6} w="full" justifyContent="space-between">
              <Text fontSize="xs">Estimated Fee</Text>
              <Text
                color="white"
                // variant="description"
                display="flex"
                gap={2}
                fontSize="xs"
              >
                Vault creation is free on Fuel Network
                <Tooltip
                  placment="top-start"
                  text="Account creation is free on Bako Safe
Bako Safe leverages Fuel predicates to manage account permissions off-chain. Therefore, the creation of accounts is entirely free of charge and not sponsored by the network."
                />
              </Text>
            </HStack>
          )}
          {tabs.tab === 2 && (
            <CreateVaultWarning
              mb={4}
              message="Before initiating high-value deposits, first conduct smaller deposits and transactions to confirm that all signers have access to their wallets and that the accounts funds can be transferred securely."
            />
          )}
          <HStack w="full" justifyContent="space-between">
            <Dialog.SecondaryAction
              variant="subtle"
              aria-label="Create Account Secondary Action"
              w={tabs.tab !== TabState.SUCCESS ? '25%' : '100%'}
              onClick={() => {
                tabs.tab === TabState.SUCCESS
                  ? steps.step.onContinue()
                  : steps.step.onCancel();
              }}
            >
              {steps.step.closeText}
            </Dialog.SecondaryAction>
            <Dialog.PrimaryAction
              w="65%"
              aria-label="Create Vault Primary Action"
              hidden={steps.step?.hide}
              onClick={steps.step?.onContinue}
              disabled={steps.step?.disable}
              loading={bakoSafeVault.isPending || form.formState.isSubmitting}
              _hover={{
                opacity: !steps.step?.disable ? 0.8 : 1,
              }}
            >
              {tabs.tab === TabState.ADDRESSES && <SquarePlusIcon />}
              {steps.step?.nextStepText}
            </Dialog.PrimaryAction>
          </HStack>
        </VStack>
      </Dialog.Actions>
    </Dialog.Modal>
  );
});

CreateVaultDialog.displayName = 'CreateVaultDialog';

export { CreateVaultDialog };
