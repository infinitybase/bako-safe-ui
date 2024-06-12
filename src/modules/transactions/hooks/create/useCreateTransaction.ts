import { bn } from 'fuels';
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

interface UseCreateTransactionParams {
  onClose: () => void;
  initialBalance?: string;
  to?: string;
  assetId?: string;
  isFirstLoading?: boolean;
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
  const getBalanceEstimatedMaxFee =
    props?.initialBalance &&
    props?.to &&
    props?.assetId &&
    props.isFirstLoading;

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

  const getBalanceWithoutReservedAmount = (
    balance: string,
    transactionFee: string,
  ) => {
    // console.log('fee:', transactionFee);
    // console.log('balance', balance);
    // console.log(
    //   'balance - reservedAmount',
    //   bn.parseUnits(balance).sub(bn.parseUnits('0.001')).format(),
    // );
    // console.log(
    //   'balance - transactionFee',
    //   bn.parseUnits(balance).sub(bn.parseUnits(transactionFee)).format(),
    // );

    const result = bn
      .parseUnits(balance)
      .sub(bn.parseUnits('0.001'))
      .sub(bn.parseUnits(transactionFee))
      .format();

    // console.log('result', result);

    return result;
  };

  useEffect(() => {
    if (getBalanceEstimatedMaxFee) {
      resolveTransactionCosts.mutate({
        assets: [
          {
            to: 'fuel1tn37x48zw6e3tylz2p0r6h6ua4l6swanmt8jzzpqt4jxmmkgw3lszpcedp',
            amount: transactionAmount,
            assetId: props.assetId ?? NativeAssetId,
          },
        ],
        vault: vaultDetails.predicateInstance!,
      });
    }

    if (Number(transactionAmount) > 0) {
      const { transactions } = form.getValues();
      resolveTransactionCosts.mutate({
        assets: transactions!.map((transaction) => ({
          to: transaction.value,
          amount: transaction.amount,
          assetId: transaction.asset,
        })),
        vault: vaultDetails.predicateInstance!,
      });
    }
  }, [transactionAmount, form.formState.isValid]);

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
    transactionFee,
    getBalanceWithoutReservedAmount,
  };
};

export type UseCreateTransaction = ReturnType<typeof useCreateTransaction>;

export { useCreateTransaction };
