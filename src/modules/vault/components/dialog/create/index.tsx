import React from 'react';

import { Dialog, DialogModalProps, SquarePlusIcon } from '@/components';
import { useCreateVaultDialog } from '@/modules/vault/hooks';

import { CreateVaultForm } from './form';

const CreateVaultDialog = (props: Omit<DialogModalProps, 'children'>) => {
  const {
    tabs,
    form,
    addresses,
    onDeposit,
    steps,
    request,
    handleCancel,
    setFormWithTemplate,
    onSaveTemplate,
  } = useCreateVaultDialog({
    onClose: props.onClose,
  });

  return (
    <Dialog.Modal {...props} onClose={handleCancel}>
      <Dialog.Header
        maxW={420}
        hidden={steps.step?.hide}
        title="Create Vault"
        description={steps.step?.description ?? ''}
      />

      <Dialog.Body maxW={420}>
        <CreateVaultForm
          tabs={tabs}
          form={form}
          steps={steps}
          onCancel={handleCancel}
          onDeposit={onDeposit}
          addresses={addresses}
          setTemplate={setFormWithTemplate}
          onSaveTemplate={onSaveTemplate}
        />
      </Dialog.Body>

      <Dialog.Actions maxW={420}>
        <Dialog.SecondaryAction onClick={steps.step.onCancel}>
          {steps.step.closeText}
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          hidden={steps.step?.hide}
          onClick={steps.step?.onContinue}
          leftIcon={<SquarePlusIcon />}
          isDisabled={steps.step?.disable}
          isLoading={request.isLoading}
        >
          Continue
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateVaultDialog };
