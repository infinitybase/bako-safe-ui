import { HStack, Text, VStack } from '@chakra-ui/react';

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

const CreateVaultDialog = (props: Omit<DialogModalProps, 'children'>) => {
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
    onClose: props.onClose,
  });

  const { isSafariBrowser, isMobile } = useVerifyBrowserType();

  const isFirstTab = tabs.tab === 0;
  const isSecondTab = tabs.tab === 1;

  const isSecondTabAndMobile = isSecondTab && isMobile;

  return (
    <Dialog.Modal
      size={{ base: 'full', md: 'xl' }}
      {...props}
      onClose={handleCancel}
      closeOnOverlayClick={false}
    >
      <Dialog.Header
        hideCloseButton={isSafariBrowser && isMobile}
        onClose={handleCancel}
        maxW={450}
        mb={0}
        pt={isSafariBrowser && isMobile ? 6 : 'unset'}
        hidden={steps.step?.hide}
        title="Create Vault"
        description={steps.step?.description ?? ''}
        descriptionFontSize="sm"
      />

      <Dialog.Body
        maxW={450}
        mb={isFirstTab ? 8 : 0}
        maxH={isFirstTab ? '60vh' : 700}
        minH={!isFirstTab ? 500 : 'unset'}
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
        sx={{
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
              <Text variant="description" fontSize="xs">
                Estimated Fee
              </Text>
              <Text
                color="white"
                variant="description"
                display="flex"
                gap={2}
                fontSize="xs"
              >
                Vault creation is free on Fuel Network
                <Tooltip
                  placment="top-start"
                  text="Vault creation is free on Bako Safe
Bako Safe leverages Fuel predicates to manage vault permissions off-chain. Therefore, the creation of vaults is entirely free of charge and not sponsored by the network."
                />
              </Text>
            </HStack>
          )}
          {tabs.tab === 2 && (
            <CreateVaultWarning
              mb={4}
              message="Before initiating high-value deposits, first conduct smaller deposits and transactions to confirm that all signers have access to their wallets and that the vault’s funds can be transferred securely."
            />
          )}
          <HStack w="full" justifyContent="space-between">
            <Dialog.SecondaryAction
              bgColor="transparent"
              border="1px solid white"
              w={tabs.tab !== TabState.SUCCESS ? '25%' : '100%'}
              onClick={
                tabs.tab === 2 ? steps.step.onContinue : steps.step.onCancel
              }
              _hover={{
                borderColor: 'brand.500',
                color: 'brand.500',
              }}
            >
              {steps.step.closeText}
            </Dialog.SecondaryAction>
            <Dialog.PrimaryAction
              w="65%"
              hidden={steps.step?.hide}
              onClick={steps.step?.onContinue}
              leftIcon={
                tabs.tab === TabState.ADDRESSES ? <SquarePlusIcon /> : undefined
              }
              isDisabled={steps.step?.disable}
              isLoading={bakoSafeVault.isPending}
              _hover={{
                opacity: !steps.step?.disable && 0.8,
              }}
            >
              {steps.step?.nextStepText}
            </Dialog.PrimaryAction>
          </HStack>
        </VStack>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateVaultDialog };
