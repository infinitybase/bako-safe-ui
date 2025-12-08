import { CloseButton, Flex, Heading, Stack, Text, VStack } from 'bako-ui';
import { useMemo, useState } from 'react';
import { useWatch } from 'react-hook-form';

import { Dialog, DialogModalProps } from '@/components';
import { useCreateTransaction } from '@/modules/transactions/hooks';
import { useVaultInfosContext } from '@/modules/vault/hooks';

import CreateTxMenuButton, {
  ECreateTransactionMethods,
} from './createTxMenuButton';
import { FeeSummary } from './feeSummary';
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
        <FeeSummary transactionFee={transactionFee} />

        <Dialog.Actions>
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
