import { Divider, Flex, Text } from '@chakra-ui/react';

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
    resolveTransactionCosts,
    handleClose,
  } = useCreateTransaction({
    onClose: props.onClose,
  });

  const transactionFee = resolveTransactionCosts.data?.fee.format();

  if (
    transactionFee &&
    !form.getValues(`transactions.${accordion.index}.fee`)
  ) {
    form.setValue(`transactions.${accordion.index}.fee`, transactionFee);
    form.trigger(`transactions.${accordion.index}.amount`);
  }

  return (
    <Dialog.Modal
      size={{ base: 'full', sm: 'xl' }}
      {...props}
      onClose={handleClose}
      closeOnOverlayClick={false}
    >
      <Dialog.Header
        position={['static', 'relative']}
        mt={[8, 0]}
        mb={0}
        maxH={40}
        top={{ base: 0, sm: -8 }}
        w="full"
        maxW={480}
        title="Create Transaction"
        description={`Send single or batch payments with multi assets. \n You can send multiple types of assets to different addresses.`}
      />

      <Dialog.Body maxW={500} maxH={'full'}>
        <CreateTransactionForm
          form={form}
          nicks={nicks}
          assets={assets}
          accordion={accordion}
          transactionsFields={transactionsFields}
        />
      </Dialog.Body>

      <Flex wrap="wrap" justifyContent="end" w="full" maxW={480} my={[3, 6]}>
        <Divider mb={2} w="full" />
        <Text
          visibility={
            resolveTransactionCosts.isLoading || !resolveTransactionCosts.data
              ? 'hidden'
              : 'visible'
          }
          variant="description"
        >
          Fee (network): {transactionFee}
        </Text>
      </Flex>

      <Dialog.Actions maxW={480} hideDivider>
        {/* TODO: Colocar o Transactions Fee entre o Divider e os botoes */}
        <Dialog.SecondaryAction onClick={handleClose}>
          Cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          leftIcon={<SquarePlusIcon />}
          isDisabled={!form.formState.isValid || !transactionFee}
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
