import React from 'react';

import { Dialog, DialogModalProps, SquarePlusIcon } from '@/components';
import { useCreateVaultDialog } from '@/modules/vault/hooks';

import { CreateVaultForm } from './form';

const CreateVaultDialog = (props: Omit<DialogModalProps, 'children'>) => {
  const { tabs, form, addresses, onDeposit, steps, request, handleCancel } =
    useCreateVaultDialog({
      onClose: props.onClose,
    });

  return (
    <Dialog.Modal {...props} onClose={handleCancel}>
      <Dialog.Header
        maxW={420}
        hidden={steps.step?.hide}
        title="Create Vault"
        description="Setting Sail on a Journey to Unlock the Potential of User-Centered
          Design."
      />

      <Dialog.Body maxW={420}>
        <CreateVaultForm
          tabs={tabs}
          form={form}
          steps={steps}
          onCancel={handleCancel}
          onDeposit={onDeposit}
          addresses={addresses}
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
          isDisabled={!form.formState.isValid}
          isLoading={request.isLoading}
        >
          Continue
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateVaultDialog };
