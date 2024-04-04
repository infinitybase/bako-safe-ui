import { Dialog, DialogModalProps, SquarePlusIcon } from '@/components';
import { TabState, useCreateVaultDialog } from '@/modules/vault/hooks';

import { CreateVaultForm } from './form';

const CreateVaultDialog = (props: Omit<DialogModalProps, 'children'>) => {
  const {
    tabs,
    form,
    addresses,
    onDeposit,
    steps,
    bsafeVault,
    handleCancel,
    setFormWithTemplate,
    onSaveTemplate,
    handleInputChange,
    vaultNameIsAvailable,
    search,
    setSearch,
  } = useCreateVaultDialog({
    onClose: props.onClose,
  });

  return (
    <Dialog.Modal
      size={{
        base: 'full',
        sm: 'xl',
      }}
      {...props}
      onClose={handleCancel}
      closeOnOverlayClick={false}
    >
      <Dialog.Header
        maxW={450}
        position="relative"
        mb={0}
        top={-6}
        hidden={steps.step?.hide}
        title="Create Vault"
        description={steps.step?.description ?? ''}
      />

      <Dialog.Body maxW={450}>
        <CreateVaultForm
          tabs={tabs}
          form={form}
          steps={steps}
          onCancel={handleCancel}
          onDeposit={onDeposit}
          addresses={addresses}
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
          isLoading={bsafeVault.isLoading}
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
