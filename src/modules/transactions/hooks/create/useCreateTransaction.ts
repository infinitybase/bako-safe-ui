import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  invalidateQueries,
  TRANSACTION_LIST_PAGINATION_QUERY_KEY,
  TRANSACTION_LIST_QUERY_KEY,
  useBsafeCreateTransaction,
  USER_TRANSACTIONS_QUERY_KEY,
  useToast,
} from '@/modules';
import { useVaultAssets, useVaultDetailsRequest } from '@/modules/vault';

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
  const toast = useToast();

  const accordion = useTransactionAccordion();

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
      toast.show({
        status: 'success',
        title: 'Transaction created',
        position: 'bottom',
        isClosable: true,
      });
      invalidateQueries([
        TRANSACTION_LIST_QUERY_KEY,
        TRANSACTION_LIST_PAGINATION_QUERY_KEY,
        USER_TRANSACTIONS_QUERY_KEY,
      ]);
      handleClose();
    },
    onError: () => {
      toast.show({
        status: 'error',
        title: 'Error on create transaction.',
        position: 'bottom',
        isClosable: true,
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
    navigate,
    accordion,
    handleClose,
  };
};

export type UseCreateTransaction = ReturnType<typeof useCreateTransaction>;

export { useCreateTransaction };
