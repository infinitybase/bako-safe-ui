import { HStack, Text, VStack } from 'bako-ui';
import { memo } from 'react';

import { Dialog, DialogModalProps, Tooltip } from '@/components';
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
    vaultNameAlreadyExists,
    search,
    setSearch,
    validateAddress,
  } = useCreateVaultDialog({
    onOpenChange: (payload) => props.onOpenChange?.(payload),
    onCreate: props.onCreate,
  });

  return (
    <Dialog.Modal
      size={{ base: 'full', sm: 'md' }}
      {...props}
      closeOnInteractOutside={false}
      modalContentProps={{
        maxH: '100vh',
        p: '0 !important',
        shadow: 'none',
      }}
      modalBodyProps={{
        maxH: '100vh',
        minH: { sm: '780px' },
      }}
    >
      <Dialog.Header
        onClose={handleCancel}
        p={6}
        pb={0}
        my={0}
        hidden={steps.step?.hide}
        title={steps.step?.title ?? ''}
        titleSxProps={{
          fontSize: 'sm',
          color: 'textPrimary',
          lineHeight: 'shorter',
        }}
        description={steps.step?.description ?? ''}
        descriptionFontSize="xs"
        descriptionColor="textSecondary"
      />

      <Dialog.Body px={6} flex={1} display="flex">
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
          vaultNameAlreadyExists={vaultNameAlreadyExists}
          search={search}
          setSearch={setSearch}
          handleInputChange={handleInputChange}
          validateAddress={validateAddress}
        />
      </Dialog.Body>
      {/* 
      <Box
        w="full"
        mt="auto"
        height="56px"
        background="linear-gradient(180deg, rgba(21, 20, 19, 0) 0%, rgba(21, 20, 19, 0.75) 30%, #151413 100%);"
      /> */}

      <Dialog.Actions
        w="full"
        p={6}
        bgColor={tabs.tab !== TabState.SUCCESS ? 'bg.muted' : 'bg.panel'}
        roundedTop="2xl"
        roundedBottom={{ base: 'none', sm: '2xl' }}
        css={{
          boxShadow:
            tabs.tab !== TabState.SUCCESS
              ? '0px -12px 8px 0px #0D0D0C99'
              : 'none',
        }}
      >
        <VStack w="full" alignItems="center" gap={6} zIndex={999}>
          <HStack
            w="full"
            justifyContent="space-between"
            display={tabs.tab === TabState.SUCCESS ? 'none' : 'flex'}
          >
            <Text
              as="div"
              fontSize="xs"
              display="flex"
              gap={2}
              color="gray.400"
            >
              Estimated Fee
              <Tooltip
                placment="top-start"
                text="Account creation is free on Bako Safe leverages Fuel predicates to manage account permissions off-chain. Therefore, the creation of accounts is entirely free of charge and not sponsored by the network."
              />
            </Text>
            <Text color="textPrimary" fontSize="xs">
              Account creation is free on Fuel Network
            </Text>
          </HStack>
          {tabs.tab === 1 && (
            <CreateVaultWarning message="Please ensure that all signer addresses are valid and accessible wallet addresses on the Fuel Network. Addresses from other Bako Safe Vaults and wallets from other networks cannot be used as signers." />
          )}
          {tabs.tab === 2 && (
            <CreateVaultWarning
              mb={4}
              message="Before initiating high-value deposits, first conduct smaller deposits and transactions to confirm that all signers have access to their wallets and that the vault’s funds can be transferred securely."
            />
          )}
          <HStack w="full" justifyContent="space-between" gap={4}>
            <Dialog.SecondaryAction
              variant={tabs.tab !== TabState.SUCCESS ? 'ghost' : 'subtle'}
              flex={tabs.tab !== TabState.SUCCESS ? 'unset' : 1}
              onClick={() => {
                tabs.tab === TabState.SUCCESS
                  ? steps.step.onContinue()
                  : steps.step.onCancel();
              }}
            >
              {steps.step.closeText}
            </Dialog.SecondaryAction>
            <Dialog.PrimaryAction
              flex={1}
              aria-label="Create Vault Primary Action"
              hidden={steps.step?.hide}
              onClick={steps.step?.onContinue}
              disabled={steps.step?.disable}
              loading={bakoSafeVault.isPending || form.formState.isSubmitting}
              _hover={{
                opacity: !steps.step?.disable ? 0.8 : 1,
              }}
            >
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
