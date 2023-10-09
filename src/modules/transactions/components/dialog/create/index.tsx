import React from 'react';

import { Dialog, DialogModalProps, SquarePlusIcon } from '@/components';
import { useCreateTransaction } from '@/modules';

import { CreateTransactionForm } from './form';

const CreateTransactionDialog = (props: Omit<DialogModalProps, 'children'>) => {
  const { form, assets, transactionsFields, transactionRequest } =
    useCreateTransaction();

  return (
    <Dialog.Modal {...props}>
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
          transactionsFields={transactionsFields}
          isCreating={transactionRequest.isLoading}
        />
      </Dialog.Body>

      <Dialog.Actions maxW={420}>
        <Dialog.SecondaryAction>Cancel</Dialog.SecondaryAction>
        <Dialog.PrimaryAction leftIcon={<SquarePlusIcon />}>
          Create transaction
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateTransactionDialog };
