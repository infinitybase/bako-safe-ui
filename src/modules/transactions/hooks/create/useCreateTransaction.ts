import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useContactToast, useListContactsRequest } from '@/modules/addressBook';
import { useAddressBookStore } from '@/modules/addressBook/store/useAddressBookStore';
import { useAuth } from '@/modules/auth';
import {
  invalidateQueries,
  useBsafeCreateTransaction,
  WorkspacesQueryKey,
} from '@/modules/core';
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
  const navigate = useNavigate();
  const params = useParams<{ vaultId: string }>();
  const { successToast, errorToast } = useContactToast();
  const accordion = useTransactionAccordion();
  const {
    workspaces: { current },
  } = useAuth();
  const { contacts } = useAddressBookStore();
  useListContactsRequest(current, true, params.vaultId);

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
      invalidateQueries([
        TRANSACTION_LIST_QUERY_KEY,
        USER_TRANSACTIONS_QUERY_KEY,
      ]);
      invalidateQueries(
        WorkspacesQueryKey.TRANSACTION_LIST_PAGINATION_QUERY_KEY(current),
      );
      handleClose();
    },
    onError: () => {
      errorToast({
        title: 'There was an error creating the transaction',
        description: 'Please try again later',
      });
    },
  });

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
    transactionsFields,
    transactionRequest,
    form: {
      ...form,
      handleCreateTransaction,
    },
    vault: vaultDetails,
    assets: vaultAssets,
    nicks: contacts,
    navigate,
    accordion,
    handleClose,
  };
};

export type UseCreateTransaction = ReturnType<typeof useCreateTransaction>;

export { useCreateTransaction };
