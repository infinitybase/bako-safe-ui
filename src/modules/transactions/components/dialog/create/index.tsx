import { Dialog, DialogModalProps, SquarePlusIcon } from '@/components';
import { useCreateTransaction } from '@/modules/transactions/hooks';

import { CreateTransactionForm } from './form';

const CreateTransactionDialog = (props: Omit<DialogModalProps, 'children'>) => {
  const {
    form,
    nicks,
    assets,
    accordion,
    transactionsFields,
    transactionRequest,
    handleClose,
  } = useCreateTransaction({
    onClose: props.onClose,
  });

  return (
    <Dialog.Modal
      size={{ base: 'full', sm: 'xl' }}
      {...props}
      onClose={handleClose}
      closeOnOverlayClick={false}
    >
      <Dialog.Header
        position="relative"
        mb={0}
        top={{ base: -5, sm: -8 }}
        w="full"
        maxW={480}
        title="Create Transaction"
        description={`Send single or batch payments with multi assets. \n You can send multiple types of assets to different addresses.`}
      />

      <Dialog.Body maxW={500} minH={640}>
        <CreateTransactionForm
          form={form}
          nicks={nicks}
          assets={assets}
          accordion={accordion}
          transactionsFields={transactionsFields}
        />
      </Dialog.Body>

      <Dialog.Actions maxW={480}>
        {/* TODO: Colocar o Transactions Fee entre o Divider e os botoes */}
        <Dialog.SecondaryAction onClick={handleClose}>
          Cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          leftIcon={<SquarePlusIcon />}
          isDisabled={!form.formState.isValid}
          isLoading={transactionRequest.isLoading}
          onClick={form.handleCreateTransaction}
          _hover={{
            opacity: form.formState.isValid && 0.8,
          }}
        >
          Create transaction
        </Dialog.PrimaryAction>
      </Dialog.Actions>
    </Dialog.Modal>
  );
};

export { CreateTransactionDialog };
