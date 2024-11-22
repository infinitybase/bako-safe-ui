import { useMutation } from '@tanstack/react-query';
import { IAssetGroupById } from 'bakosafe';
import { BN, bn } from 'fuels';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useContactToast } from '@/modules/addressBook';
import {
  Asset,
  NativeAssetId,
  NFT,
  useBakoSafeCreateTransaction,
  useBakoSafeVault,
  useGetTokenInfosArray,
} from '@/modules/core';
import { TransactionService } from '@/modules/transactions/services';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useTransactionsContext } from '../../providers/TransactionsProvider';
import { generateTransactionName } from '../../utils';
import { useCreateTransactionForm } from './useCreateTransactionForm';

const recipientMock =
  'fuel1tn37x48zw6e3tylz2p0r6h6ua4l6swanmt8jzzpqt4jxmmkgw3lszpcedp';

interface UseCreateTransactionParams {
  onClose: () => void;
  isOpen: boolean;
  assets: Asset[] | undefined;
  nfts?: NFT[];
  hasAssetBalance: (assetId: string, value: string) => boolean;
  getCoinAmount: (assetId: string, needsFormat?: boolean | undefined) => BN;
  createTransactionAndSign: boolean;
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
  const {
    transactionsPageList: {
      request: { refetch: refetchTransactionsList },
    },
    homeTransactions: {
      request: { refetch: refetchHomeTransactionsList },
    },
    vaultTransactions: {
      request: { refetch: refetchVaultTransactionsList },
    },
    signTransaction: { confirmTransaction },
  } = useTransactionsContext();

  const {
    vaultDetails: {
      vaultRequest: {
        data: { predicateAddress, provider, id },
      },
      assets: { refetchAssets },
    },
    addressBookInfos: {
      requests: { listContactsRequest },
    },
    assetsMap,
  } = useWorkspaceContext();

  const [firstRender, setFirstRender] = useState(true);
  const [validTransactionFee, setValidTransactionFee] = useState<
    string | undefined
  >(undefined);

  const navigate = useNavigate();

  const { successToast, errorToast } = useContactToast();
  const accordion = useTransactionAccordion();

  const resolveTransactionCosts = useMutation({
    mutationFn: TransactionService.resolveTransactionCosts,
  });

  const transactionFee = resolveTransactionCosts.data?.fee.format();

  const { transactionsFields, form } = useCreateTransactionForm({
    assets: props?.assets?.map((asset) => ({
      amount: asset.amount!,
      assetId: asset.assetId,
    })),
    nfts: props?.nfts,
    assetsMap,
    getCoinAmount: (asset) => props?.getCoinAmount(asset) ?? bn(''),
    validateBalance: (asset, amount) =>
      props?.hasAssetBalance(asset, amount) ?? false,
  });

  const { vault, isLoading: isLoadingVault } = useBakoSafeVault({
    address: predicateAddress,
    provider,
    id,
  });

  const transactionRequest = useBakoSafeCreateTransaction({
    vault: vault!,
    assetsMap,
    onSuccess: (transaction) => {
      successToast({
        title: 'Transaction created!',
        description: 'Your transaction was successfully created...',
      });

      refetchTransactionsList();
      refetchHomeTransactionsList();
      refetchVaultTransactionsList();
      if (props?.createTransactionAndSign) {
        confirmTransaction(transaction.id, undefined, transaction);
      }
      handleClose();
    },
    onError: () => {
      errorToast({
        title: 'There was an error creating the transaction',
        description: 'Please try again later',
      });
    },
  });

  const handleCreateTransaction = form.handleSubmit((data) => {
    transactionRequest.mutate(
      {
        name: data.name?.trimStart() ? data.name : generateTransactionName(),
        assets: data.transactions!.map((transaction) => ({
          amount: transaction.amount,
          assetId: transaction.asset,
          to: transaction.value,
        })),
        handle: data.handle,
        resolver: data.resolver,
      },
      {
        onSuccess: () => {
          refetchAssets();
        },
      },
    );
  });

  const handleCreateAndSignTransaction = form.handleSubmit((data) => {
    transactionRequest.mutate(
      {
        name: data.name?.trimStart() ? data.name : generateTransactionName(),
        assets: data.transactions!.map((transaction) => ({
          amount: transaction.amount,
          assetId: transaction.asset,
          to: transaction.value,
        })),
        handle: data.handle,
        resolver: data.resolver,
      },
      {
        onSuccess: () => {
          refetchAssets();
        },
      },
    );
  });

  // Balance available
  const currentVaultAssets = props?.assets;

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

  const formattedCurrentAssetBalance = useGetTokenInfosArray(
    currentVaultAssets ?? [],
    assetsMap,
  );

  const getBalanceAvailable = useCallback(() => {
    const currentAssetBalance = bn.parseUnits(
      formattedCurrentAssetBalance?.find(
        (asset) => asset.assetId === currentFieldAsset,
      )?.amount ?? '0',
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
    const isNFT = !!props?.nfts?.find(
      (nft) => nft.assetId === currentFieldAsset,
    );
    const transactionFee = bn.parseUnits(validTransactionFee ?? '0');

    let balanceAvailable = '0.000';

    if (isEthTransaction && balanceAvailableWithoutFee.gte(transactionFee)) {
      balanceAvailable = balanceAvailableWithoutFee
        .sub(transactionFee)
        .format();
    }

    if (!isEthTransaction) {
      balanceAvailable = isNFT
        ? bn(1).format({ units: -9, precision: 0 })
        : balanceAvailableWithoutFee.format();
    }

    return balanceAvailable;
  }, [
    currentFieldAmount,
    validTransactionFee,
    transactionAssetsTotalAmount,
    currentVaultAssets,
  ]);

  const handleClose = () => {
    props?.onClose();
  };

  const debouncedResolveTransactionCosts = useCallback(
    debounce((assets, vault) => {
      resolveTransactionCosts.mutate({ assets, vault });
    }, 300),
    [],
  );

  useEffect(() => {
    const _transactionFee =
      transactionFee && Number(transactionFee) > 0 ? transactionFee : null;
    const newFee = _transactionFee || validTransactionFee || '0.000';
    const transactions = form.getValues('transactions') || [];

    transactions.forEach((_, index) => {
      form.setValue(`transactions.${index}.fee`, newFee, {
        shouldValidate: true,
      });
    });

    setValidTransactionFee(newFee);
  }, [transactionFee]);

  useEffect(() => {
    if (Number(currentFieldAmount) > 0 && validTransactionFee) {
      form.trigger(`transactions.${accordion.index}.amount`);
    }
  }, [accordion.index, resolveTransactionCosts.data, currentFieldAsset]);

  useEffect(() => {
    if (
      (currentFieldAsset && !currentFieldAmount) ||
      Number(currentFieldAmount) === 0
    )
      return;

    const transactions = form.getValues('transactions');

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

    debouncedResolveTransactionCosts(assets, vault!);
  }, [transactionTotalAmount, currentVaultAssets, currentFieldAsset].filter(Boolean));

  useEffect(() => {
    if (firstRender && vault) {
      debouncedResolveTransactionCosts([], vault!);
      setFirstRender(false);
    }
  }, [vault]);

  return {
    resolveTransactionCosts,
    transactionsFields,
    transactionRequest,
    form: {
      ...form,
      handleCreateTransaction,
      handleCreateAndSignTransaction,
    },
    nicks: listContactsRequest.data ?? [],
    navigate,
    accordion,
    handleClose,
    transactionFee: validTransactionFee,
    getBalanceAvailable,
    isLoadingVault,
  };
};

export type UseCreateTransaction = ReturnType<typeof useCreateTransaction>;

export { useCreateTransaction };
