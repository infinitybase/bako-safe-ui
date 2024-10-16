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
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

import { Dialog, DialogModalProps } from '@/components';
import { TooltipIcon } from '@/components/icons/tooltip';
import { useCreateTransaction } from '@/modules/transactions/hooks';
import { useVaultInfosContext } from '@/modules/vault/VaultInfosProvider';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import CreateTxMenuButton, {
  ECreateTransactionMethods,
} from './createTxMenuButton';
import { CreateTransactionForm } from './form';

const CreateTransactionDialog = (props: Omit<DialogModalProps, 'children'>) => {
  const [createTxMethod, setCreateTxMethod] =
    useState<ECreateTransactionMethods>(
      ECreateTransactionMethods.CREATE_AND_SIGN,
    );
  const { assets } = useVaultInfosContext();
  const {
    form,
    nicks,
    accordion,
    transactionsFields,
    transactionRequest,
    resolveTransactionCosts,
    transactionFee,
    isLoadingVault,
    getBalanceAvailable,
    handleClose,
  } = useCreateTransaction({
    assets: assets.assets,
    nfts: assets.nfts,
    hasAssetBalance: assets.hasAssetBalance,
    getCoinAmount: assets.getCoinAmount,
    onClose: props.onClose,
    isOpen: props.isOpen,
    createTransactionAndSign:
      createTxMethod === ECreateTransactionMethods.CREATE_AND_SIGN,
  });

  const { isOpen, onToggle, onClose } = useDisclosure();
  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  const currentAmount = form.watch(`transactions.${accordion.index}.amount`);
  const isCurrentAmountZero = Number(currentAmount) === 0;
  const isTransactionFeeLoading =
    isLoadingVault ||
    resolveTransactionCosts.isPending ||
    !transactionFee ||
    Number(transactionFee) === 0;

  const isDisabled =
    !form.formState.isValid ||
    form.formState.isSubmitting ||
    isCurrentAmountZero ||
    isTransactionFeeLoading;

  const isLoading = transactionRequest.isPending || form.formState.isSubmitting;

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

      <Dialog.Body maxW={480} maxH={'full'} mt={{ sm: 4 }}>
        <CreateTransactionForm
          form={form}
          nicks={nicks}
          assets={assets}
          accordion={accordion}
          transactionsFields={transactionsFields}
          isFeeCalcLoading={isTransactionFeeLoading}
          getBalanceAvailable={getBalanceAvailable}
        />
      </Dialog.Body>

      <VStack
        // Logic to fix buttons in the footer
        // position={isMobile ? 'absolute' : 'unset'}
        // zIndex={999}
        // bottom={0}
        // left={0}
        // right={0}
        // px={isSmall ? 6 : 'unset'}
        w="full"
        bg={isMobile ? 'dark.950' : 'unset'}
        maxW={480}
        justifySelf="center"
        mt={6}
        pb={4}
      >
        <Flex
          wrap="wrap"
          justifyContent="space-between"
          w="full"
          mb={{ base: 3, sm: 6 }}
          mt={0.5}
        >
          <Divider mb={2} w="full" />
          <Text
            visibility={!transactionFee ? 'hidden' : 'visible'}
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

        <Dialog.Actions hideDivider>
          <Dialog.SecondaryAction onClick={handleClose}>
            Cancel
          </Dialog.SecondaryAction>

          <CreateTxMenuButton
            createTxMethod={createTxMethod}
            setCreateTxMethod={setCreateTxMethod}
            isLoading={isLoading}
            isDisabled={isDisabled}
            handleCreateTransaction={form.handleCreateTransaction}
            handleCreateAndSignTransaction={form.handleCreateAndSignTransaction}
          />
        </Dialog.Actions>
      </VStack>
    </Dialog.Modal>
  );
};

export { CreateTransactionDialog };
