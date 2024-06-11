import {
  Divider,
  Flex,
  Icon,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';

import { Dialog, DialogModalProps, SquarePlusIcon } from '@/components';
import { TooltipIcon } from '@/components/icons/tooltip';
import { useVerifyBrowserType } from '@/modules/dapp/hooks';
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
    transactionFee,
  } = useCreateTransaction({
    onClose: props.onClose,
  });

  const { isOpen, onToggle, onClose } = useDisclosure();
  const { isMobile } = useVerifyBrowserType();

  if (
    transactionFee &&
    !form.getValues(`transactions.${accordion.index}.fee`)
  ) {
    form.setValue(`transactions.${accordion.index}.fee`, transactionFee);
    form.trigger(`transactions.${accordion.index}.amount`);
  }
  const currentAmount = form.watch(`transactions.${accordion.index}.amount`);
  const isCurrentAmountZero = Number(currentAmount) === 0;

  return (
    <Dialog.Modal
      {...props}
      onClose={handleClose}
      closeOnOverlayClick={false}
      size={{ base: 'full', sm: 'lg' }}
    >
      <Dialog.Header
        onClose={handleClose}
        position={{ base: 'static', sm: 'relative' }}
        mb={0}
        maxH={40}
        maxW={480}
        title="Create Transaction"
        description={`Send single or batch payments with multi assets. \n You can send multiple types of assets to different addresses.`}
      />

      <Dialog.Body maxW={500} maxH={'full'} mt={{ sm: 4 }}>
        <CreateTransactionForm
          form={form}
          nicks={nicks}
          assets={assets}
          accordion={accordion}
          transactionsFields={transactionsFields}
          isFeeCalcLoading={resolveTransactionCosts.isLoading}
        />
      </Dialog.Body>

      <Flex
        wrap="wrap"
        justifyContent="space-between"
        w="full"
        maxW={480}
        my={{ base: 3, sm: 6 }}
      >
        <Divider mb={2} w="full" />
        <Text
          visibility={
            resolveTransactionCosts.isLoading || !resolveTransactionCosts.data
              ? 'hidden'
              : 'visible'
          }
          variant="description"
        >
          Max fee:{' '}
          {isMobile ? (
            <Popover placement="top-start" isOpen={isOpen} onClose={onClose}>
              <PopoverTrigger>
                <Icon
                  color="grey.200"
                  boxSize="14px"
                  as={TooltipIcon}
                  onClick={onToggle}
                />
              </PopoverTrigger>
              <PopoverContent
                bg="grey.825"
                p={2}
                borderColor="dark.100"
                maxW={270}
                display={!isOpen ? 'none' : 'block'}
                _focus={{ ring: 'none' }}
              >
                <PopoverCloseButton />
                <PopoverBody color="white">
                  {`Max Fee is the most that you might pay for the transaction. Only the actual fee will be deducted from your wallet. 100% of this fee goes to the network.`}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          ) : (
            <Tooltip
              label="Max Fee is the most that you might pay for the transaction. Only the actual fee will be deducted from your wallet. 100% of this fee goes to the network."
              fontSize="xs"
              bg="grey.825"
              rounded={8}
              maxW={270}
              overflow="hidden"
              placement="top-start"
              padding={4}
              closeOnScroll
            >
              <Icon color="grey.200" boxSize="14px" as={TooltipIcon} />
            </Tooltip>
          )}
        </Text>
        <Text variant="description">
          {transactionFee} {transactionFee && 'ETH'}
        </Text>
      </Flex>

      <Dialog.Actions maxW={480} hideDivider mt="auto">
        {/* TODO: Colocar o Transactions Fee entre o Divider e os botoes */}
        <Dialog.SecondaryAction onClick={handleClose}>
          Cancel
        </Dialog.SecondaryAction>
        <Dialog.PrimaryAction
          leftIcon={<SquarePlusIcon />}
          isDisabled={!form.formState.isValid || isCurrentAmountZero}
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
