import { Dialog, DialogModalProps, SquarePlusIcon } from '@/components';
import { useVerifyBrowserType } from '@/modules/dapp/hooks';
import { TabState, useCreateVaultDialog } from '@/modules/vault/hooks';

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
  } = useCreateVaultDialog({
    onClose: props.onClose,
  });

  const { isSafariBrowser, isMobile } = useVerifyBrowserType();

  const isFirstTab = tabs.tab === 0;
  const secondTabMinHeight = addresses.fields.length >= 2 ? 645 : 550;

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
      />

      <Dialog.Body
        maxW={450}
        minH={{ base: isFirstTab ? '60vh' : secondTabMinHeight, sm: 'unset' }}
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
        />
      </Dialog.Body>

      <Dialog.Actions w="full" maxW={450} mt="auto">
        <Dialog.SecondaryAction
          bgColor="transparent"
          border="1px solid white"
          w={tabs.tab !== TabState.SUCCESS ? '25%' : '100%'}
          onClick={steps.step.onCancel}
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
          isLoading={bakoSafeVault.isLoading}
          _hover={{
            opacity: !steps.step?.disable && 0.8,
          }}
        >
          {steps.step?.nextStepText}
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateVaultDialog };
