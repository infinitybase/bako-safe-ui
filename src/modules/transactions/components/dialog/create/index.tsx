import {
  CloseButton,
  Flex,
  Heading,
  Icon,
  Popover,
  Stack,
  Text,
  VStack,
} from 'bako-ui';
import { useMemo, useState } from 'react';
import { useWatch } from 'react-hook-form';

import { Dialog, DialogModalProps } from '@/components';
import { TooltipIcon } from '@/components/icons/tooltip';
import { Tooltip } from '@/components/ui/tooltip';
import { useDisclosure } from '@/modules/core/hooks/useDisclosure';
import { useCreateTransaction } from '@/modules/transactions/hooks';
import { useVaultInfosContext } from '@/modules/vault/hooks';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

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

  const createTransactionParams = useMemo(
    () => ({
      assets: assets.assets,
      nfts: assets.nfts,
      hasAssetBalance: assets.hasAssetBalance,
      getCoinAmount: assets.getCoinAmount,
      onClose: props.onOpenChange,
      open: props.open,
      createTransactionAndSign:
        createTxMethod === ECreateTransactionMethods.CREATE_AND_SIGN,
    }),
    [
      assets.assets,
      assets.nfts,
      assets.hasAssetBalance,
      assets.getCoinAmount,
      props.onOpenChange,
      props.open,
      createTxMethod,
    ],
  );

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
  } = useCreateTransaction(createTransactionParams);

  const { isOpen, onToggle, onOpenChange } = useDisclosure();
  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();

  const currentAmount = useWatch({
    control: form.control,
    name: `transactions.${accordion.index}.amount`,
  });

  const isCurrentAmountZero = useMemo(
    () => Number(currentAmount) === 0,
    [currentAmount],
  );

  const isTransactionFeeLoading = useMemo(
    () =>
      isLoadingVault ||
      resolveTransactionCosts.isPending ||
      !transactionFee ||
      Number(transactionFee) === 0,
    [isLoadingVault, resolveTransactionCosts.isPending, transactionFee],
  );

  const isDisabled = useMemo(
    () =>
      !form.formState.isValid ||
      form.formState.isSubmitting ||
      isCurrentAmountZero ||
      isTransactionFeeLoading ||
      !!resolveTransactionCosts.error,
    [
      form.formState.isValid,
      form.formState.isSubmitting,
      isCurrentAmountZero,
      isTransactionFeeLoading,
      resolveTransactionCosts.error,
    ],
  );

  const isLoading = useMemo(
    () => transactionRequest.isPending || form.formState.isSubmitting,
    [transactionRequest.isPending, form.formState.isSubmitting],
  );

  return (
    <Dialog.Modal
      {...props}
      open
      onOpenChange={(e) => {
        if (!e.open) handleClose();
      }}
      closeOnInteractOutside={false}
      size={{ base: 'full', sm: 'md' }}
      modalContentProps={{ sm: { minH: '700px' }, p: '0 !important' }}
      xsBreakPointPy={0}
    >
      <Stack p={6} gap={3}>
        <Flex alignItems="center" justifyContent="space-between">
          <Heading fontSize="sm" color="textPrimary" lineHeight="short">
            Create Transaction
          </Heading>
          <CloseButton size="2xs" onClick={handleClose} />
        </Flex>
        <Text fontSize="xs" color="textSecondary">
          Send single or batch payments with multi assets. You can send multiple
          types of assets to different addresses.
        </Text>
      </Stack>

      <Dialog.Body px={6} maxH={'full'} mt={{ sm: 4 }} flex={1}>
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
        w="full"
        bg="bg.muted"
        p={6}
        justifySelf="center"
        mt={6}
        roundedBottom={{ base: 'none', sm: '2xl' }}
      >
        <Flex
          wrap="wrap"
          justifyContent="space-between"
          w="full"
          mb={{ base: 3, sm: 6 }}
          mt={0.5}
        >
          <Text
            visibility={!transactionFee ? 'hidden' : 'visible'}
            fontSize="xs"
            lineHeight="shorter"
          >
            Max fee:{' '}
            {isMobile ? (
              <Popover.Root
                positioning={{ placement: 'top-start' }}
                open={isOpen}
                onOpenChange={onOpenChange}
              >
                <Popover.Trigger>
                  <Icon
                    color="textPrimary"
                    boxSize="14px"
                    as={TooltipIcon}
                    onClick={onToggle}
                  />
                </Popover.Trigger>
                <Popover.Content
                  bg="bg.muted"
                  p={2}
                  borderColor="bg.panel/80"
                  maxW={270}
                  display={!isOpen ? 'none' : 'block'}
                  _focus={{ ring: 'none' }}
                >
                  <Popover.CloseTrigger />
                  <Popover.Body color="white">
                    {`Max Fee is the most that you might pay for the transaction. Only the actual fee will be deducted from your wallet. 100% of this fee goes to the network.`}
                  </Popover.Body>
                </Popover.Content>
              </Popover.Root>
            ) : (
              <Tooltip
                content="Max Fee is the most that you might pay for the transaction. Only the actual fee will be deducted from your wallet. 100% of this fee goes to the network."
                // fontSize="xs"
                // bg="grey.825"
                // rounded={8}
                // maxW={270}
                // overflow="hidden"
                positioning={{ placement: 'top-start' }}
                // padding={4}
                closeOnScroll
              >
                <Icon color="gray.200" boxSize="14px" as={TooltipIcon} />
              </Tooltip>
            )}
          </Text>
          <Text fontSize="xs" lineHeight="shorter">
            {transactionFee && `< ${transactionFee} ETH`}
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
