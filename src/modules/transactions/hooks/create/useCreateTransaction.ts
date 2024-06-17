import { bn } from 'fuels';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { queryClient } from '@/config';
import { useContactToast, useListContactsRequest } from '@/modules/addressBook';
import { useAuth } from '@/modules/auth';
import {
  NativeAssetId,
  useBakoSafeCreateTransaction,
  WorkspacesQueryKey,
} from '@/modules/core';
import { TransactionService } from '@/modules/transactions/services';
import { useVaultAssets, useVaultDetailsRequest } from '@/modules/vault';

import {
  TRANSACTION_LIST_QUERY_KEY,
  USER_TRANSACTIONS_QUERY_KEY,
} from '../list';
import { useCreateTransactionForm } from './useCreateTransactionForm';

const recipientMock =
  'fuel1tn37x48zw6e3tylz2p0r6h6ua4l6swanmt8jzzpqt4jxmmkgw3lszpcedp';

interface UseCreateTransactionParams {
  onClose: () => void;
}

const useTransactionAccordion = () => {
  const [accordionIndex, setAccordionIndex] = useState(0);

  const close = useCallback(() => setAccordionIndex(-1), []);

  const open = useCallback((index: number) => setAccordionIndex(index), []);

  return {
    open,
    close,
    index: accordionIndex,
  };
};

const useCreateTransaction = (props?: UseCreateTransactionParams) => {
  const [validTransactionFee, setValidTransactionFee] = useState<
    string | undefined
  >(undefined);

  const auth = useAuth();
  const navigate = useNavigate();
  const params = useParams<{ vaultId: string }>();

  const { successToast, errorToast } = useContactToast();
  const accordion = useTransactionAccordion();

  const listContactsRequest = useListContactsRequest({
    current: auth.workspaces.current,
    includePersonal: !auth.isSingleWorkspace,
  });

  const resolveTransactionCosts = useMutation({
    mutationFn: TransactionService.resolveTransactionCosts,
  });

  const transactionFee = resolveTransactionCosts.data?.fee.format();

  // Vault
  const vaultDetails = useVaultDetailsRequest(params.vaultId!);
  const vaultAssets = useVaultAssets(vaultDetails?.predicateInstance);

  // TODO: For multi-asset use the vault balances
  const vaultBalance = vaultAssets.getCoinBalance(NativeAssetId);

  const { transactionsFields, form } = useCreateTransactionForm({
    assets: vaultAssets.assets?.map((asset) => ({
      amount: asset.amount,
      assetId: asset.assetId,
    })),
    getCoinAmount: (asset) => vaultAssets.getCoinAmount(asset),
    validateBalance: (asset, amount) =>
      vaultAssets.hasAssetBalance(asset, amount),
  });
  const transactionRequest = useBakoSafeCreateTransaction({
    vault: vaultDetails.predicateInstance!,
    onSuccess: () => {
      successToast({
        title: 'Transaction created!',
        description: 'Your transaction was successfully created...',
      });
      queryClient.invalidateQueries([
        WorkspacesQueryKey.TRANSACTION_LIST_PAGINATION_QUERY_KEY(
          auth.workspaces.current,
        ),
        TRANSACTION_LIST_QUERY_KEY,
        USER_TRANSACTIONS_QUERY_KEY,
      ]);
      handleClose();
    },
    onError: () => {
      errorToast({
        title: 'There was an error creating the transaction',
        description: 'Please try again later',
      });
    },
  });

  const transactionAmount = form.watch(
    `transactions.${accordion.index}.amount`,
  );

  const transactionTotalAmount = form
    .watch('transactions')
    ?.reduce((acc, t) => acc.add(bn.parseUnits(t.amount)), bn(0))
    ?.format();

  const getBalanceAvailable = useCallback(() => {
    // TODO: For multi assets consider the assetId
    const assetInputsAmount =
      transactionTotalAmount && Number(transactionTotalAmount) > 0
        ? bn
            .parseUnits(transactionTotalAmount)
            .sub(bn.parseUnits(transactionAmount))
        : bn(0);

    const balanceAvailable = bn(bn.parseUnits(vaultBalance))
      .sub(assetInputsAmount)
      .sub(bn.parseUnits(validTransactionFee ?? '0'))
      .format();

    return balanceAvailable;
  }, [
    transactionAmount,
    validTransactionFee,
    transactionTotalAmount,
    vaultBalance,
  ]);

  const handleClose = () => {
    props?.onClose();
  };

  const handleCreateTransaction = form.handleSubmit((data) => {
    transactionRequest.mutate({
      name: data.name,
      assets: data.transactions!.map((transaction) => ({
        amount: transaction.amount,
        assetId: transaction.asset,
        to: transaction.value,
      })),
    });
  });

  const debouncedResolveTransactionCosts = useCallback(
    debounce((assets, vault) => {
      resolveTransactionCosts.mutate({ assets, vault });
    }, 300),
    [],
  );

  useEffect(() => {
    if (transactionFee) {
      setValidTransactionFee(transactionFee);
      form.setValue(`transactions.${accordion.index}.fee`, transactionFee);
    } else if (validTransactionFee) {
      form.setValue(`transactions.${accordion.index}.fee`, validTransactionFee);
    }
  }, [transactionFee]);

  useEffect(() => {
    if (Number(transactionAmount) > 0 && validTransactionFee) {
      form.trigger(`transactions.${accordion.index}.amount`);
    }
  }, [accordion.index, validTransactionFee]);

  useEffect(() => {
    const { transactions } = form.getValues();

    const assets =
      Number(transactionTotalAmount) > 0
        ? transactions!
            .map((transaction) => ({
              to: transaction.value,
              amount: transaction.amount,
              assetId: transaction.asset,
            }))
            .filter(
              (transaction) =>
                transaction.to !== '' &&
                !isNaN(Number(transaction.amount)) &&
                Number(transaction.amount) > 0,
            )
        : [
            {
              to: recipientMock,
              amount: vaultBalance,
              assetId: NativeAssetId,
            },
          ]; // TODO: For multi-asset use the vault balances

    debouncedResolveTransactionCosts(assets, vaultDetails.predicateInstance!);
  }, [transactionTotalAmount, vaultBalance]);

  return {
    resolveTransactionCosts,
    transactionsFields,
    transactionRequest,
    form: {
      ...form,
      handleCreateTransaction,
    },
    vault: vaultDetails,
    assets: vaultAssets,
    nicks: listContactsRequest.data ?? [],
    navigate,
    accordion,
    handleClose,
    transactionFee: validTransactionFee,
    getBalanceAvailable,
  };
};

export type UseCreateTransaction = ReturnType<typeof useCreateTransaction>;

export { useCreateTransaction };
