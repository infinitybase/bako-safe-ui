import React from 'react';

import { Dialog, DialogModalProps, SquarePlusIcon } from '@/components';
import { useCreateTransaction } from '@/modules';

import { CreateTransactionForm } from './form';

const CreateTransactionDialog = (props: Omit<DialogModalProps, 'children'>) => {
  const {
    form,
    assets,
    transactionsFields,
    transactionRequest,
    accordion,
    handleClose,
  } = useCreateTransaction({
    onClose: props.onClose,
  });

  return (
    <Dialog.Modal {...props} onClose={handleClose}>
      <Dialog.Header
        w="full"
        maxW={420}
        title="Create Transaction"
        description="Setting Sail on a Journey to Unlock the Potential of User-Centered Design."
      />

      <Dialog.Body maxW={420}>
        <CreateTransactionForm
          form={form}
          assets={assets}
          accordion={accordion}
          transactionsFields={transactionsFields}
        />
      </Dialog.Body>

      <Dialog.Actions maxW={420}>
        <Dialog.SecondaryAction onClick={handleClose}>
          Cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          leftIcon={<SquarePlusIcon />}
          isDisabled={!form.formState.isValid}
          isLoading={transactionRequest.isLoading}
          onClick={form.handleCreateTransaction}
        >
          Create transaction
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateTransactionDialog };
