import { useCallback, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

import { queryClient } from '@/config';
import { useContactToast, useListContactsRequest } from '@/modules/addressBook';
import { useAuth } from '@/modules/auth';
import { useBsafeCreateTransaction, WorkspacesQueryKey } from '@/modules/core';
import { TransactionService } from '@/modules/transactions/services';
import { useVaultAssets, useVaultDetailsRequest } from '@/modules/vault';

import {
  TRANSACTION_LIST_QUERY_KEY,
  USER_TRANSACTIONS_QUERY_KEY,
} from '../list';
import { useCreateTransactionForm } from './useCreateTransactionForm';

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
  const auth = useAuth();
  const navigate = useNavigate();
  const params = useParams<{ vaultId: string }>();

  const { successToast, errorToast } = useContactToast();
  const accordion = useTransactionAccordion();

  const listContactsRequest = useListContactsRequest({
    current: auth.workspaces.current,
    includePersonal: auth.isSingleWorkspace,
  });

  const resolveTransactionCosts = useMutation({
    mutationFn: TransactionService.resolveTransactionCosts,
  });

  // Vault
  const vaultDetails = useVaultDetailsRequest(params.vaultId!);
  const vaultAssets = useVaultAssets(vaultDetails?.predicateInstance);

  const { transactionsFields, form } = useCreateTransactionForm({
    assets: vaultAssets.assets?.map((asset) => ({
      amount: asset.amount,
      assetId: asset.assetId,
    })),
    getCoinAmount: (asset) => vaultAssets.getCoinAmount(asset),
    validateBalance: (asset, amount) =>
      vaultAssets.hasAssetBalance(asset, amount),
  });
  const transactionRequest = useBsafeCreateTransaction({
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

  useEffect(() => {
    if (Number(transactionAmount) > 0 && form.formState.isValid) {
      const { transactions } = form.getValues();
      resolveTransactionCosts.mutate({
        assets: transactions!.map((transaction) => ({
          to: transaction.to,
          amount: transaction.amount,
          assetId: transaction.asset,
        })),
        vault: vaultDetails.predicateInstance!,
      });
    }
  }, [form.formState.isValid, transactionAmount]);

  const handleClose = () => {
    props?.onClose();
    form.reset();
  };

  const handleCreateTransaction = form.handleSubmit((data) => {
    transactionRequest.mutate({
      name: data.name,
      assets: data.transactions!.map((transaction) => ({
        amount: transaction.amount,
        assetId: transaction.asset,
        to: transaction.to,
      })),
    });
  });

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
  };
};

export type UseCreateTransaction = ReturnType<typeof useCreateTransaction>;

export { useCreateTransaction };
