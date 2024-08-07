import { BakoSafe, IAssetGroupById } from 'bakosafe';
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

  // Balance available
  const currentVaultAssets = vaultAssets.assets;
  const currentFieldAmount = form.watch(
    `transactions.${accordion.index}.amount`,
  );
  const currentFieldAsset = form.watch(`transactions.${accordion.index}.asset`);

  const transactionTotalAmount = form
    .watch('transactions')
    ?.reduce((acc, t) => acc.add(bn.parseUnits(t.amount)), bn(0))
    ?.format();
  const transactionAssetsTotalAmount = form
    .watch('transactions')
    ?.reduce((acc, tx) => {
      const { asset, amount } = tx;

      if (!acc[asset]) {
        acc[asset] = bn.parseUnits(amount);
      } else {
        acc[asset] = acc[asset].add(bn.parseUnits(amount));
      }

      return acc;
    }, {} as IAssetGroupById);

  const getBalanceAvailable = useCallback(() => {
    const currentAssetBalance = bn.parseUnits(
      currentVaultAssets?.find((asset) => asset.assetId === currentFieldAsset)
        ?.amount ?? '0',
    );

    const currentAssetAmount =
      transactionAssetsTotalAmount?.[currentFieldAsset] ?? bn(0);

    const assetFieldsAmount = currentAssetAmount.gt(0)
      ? currentAssetAmount.sub(bn.parseUnits(currentFieldAmount))
      : currentAssetAmount;

    const balanceAvailableWithoutFee = assetFieldsAmount.gte(
      currentAssetBalance,
    )
      ? bn(0)
      : currentAssetBalance.sub(assetFieldsAmount);

    const isEthTransaction = currentFieldAsset === NativeAssetId;

    const transactionFee = bn.parseUnits(validTransactionFee ?? '0');

    let balanceAvailable = '0.000';

    if (isEthTransaction && balanceAvailableWithoutFee.gte(transactionFee)) {
      balanceAvailable = balanceAvailableWithoutFee
        .sub(transactionFee)
        .format();
    }

    if (!isEthTransaction) {
      balanceAvailable = balanceAvailableWithoutFee.format();
    }

    return balanceAvailable;
  }, [
    currentFieldAmount,
    validTransactionFee,
    transactionAssetsTotalAmount,
    currentVaultAssets,
  ]);

  const currentEthBalance = vaultAssets.getCoinBalance(NativeAssetId);
  const isEthBalanceLowerThanReservedAmount =
    Number(currentEthBalance) <=
    Number(
      bn.parseUnits(BakoSafe.getGasConfig('BASE_FEE').toString()).format(),
    );

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
    } else {
      const txFee = BakoSafe.getGasConfig('BASE_FEE').toString();
      setValidTransactionFee(txFee);
      form.setValue(`transactions.${accordion.index}.fee`, txFee);
    }
  }, [transactionFee]);

  useEffect(() => {
    if (Number(currentFieldAmount) > 0 && validTransactionFee) {
      form.trigger(`transactions.${accordion.index}.amount`);
    }
  }, [accordion.index, resolveTransactionCosts.data, currentFieldAsset]);

  useEffect(() => {
    const { transactions } = form.getValues();

    const assets =
      Number(transactionTotalAmount) > 0
        ? transactions!
            .map((transaction) => ({
              to: transaction.value || recipientMock,
              amount: transaction.amount,
              assetId: transaction.asset,
            }))
            .filter(
              (transaction) =>
                !isNaN(Number(transaction.amount)) &&
                Number(transaction.amount) > 0,
            )
        : currentVaultAssets?.map((asset) => ({
            to: recipientMock,
            amount: asset.amount,
            assetId: asset.assetId,
          }));

    debouncedResolveTransactionCosts(assets, vaultDetails.predicateInstance!);
  }, [transactionTotalAmount, currentVaultAssets, currentFieldAsset]);

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
    isEthBalanceLowerThanReservedAmount,
  };
};

export type UseCreateTransaction = ReturnType<typeof useCreateTransaction>;

export { useCreateTransaction };
