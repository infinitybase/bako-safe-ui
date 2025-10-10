import { DialogOpenChangeDetails } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { IAssetGroupById } from 'bakosafe';
import { BN, bn } from 'fuels';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWatch } from 'react-hook-form';
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
import { useTransactionAccordion } from './useTransactionAccordion';

const recipientMock =
  'fuel1tn37x48zw6e3tylz2p0r6h6ua4l6swanmt8jzzpqt4jxmmkgw3lszpcedp';

interface UseCreateTransactionParams {
  onClose?: (e: DialogOpenChangeDetails) => void;
  open?: boolean;
  assets: Asset[] | undefined;
  nfts?: NFT[];
  hasAssetBalance: (assetId: string, value: string) => boolean;
  getCoinAmount: (assetId: string, needsFormat?: boolean | undefined) => BN;
  createTransactionAndSign: boolean;
}

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
    onError: (error) => {
      if (
        error.message.includes('255 coin limit') ||
        error.message.includes('no coins')
      ) {
        form.setError(`transactions.${accordion.index}.amount`, {
          message: '⚠️ Not enough ETH to pay for transaction fee!',
          type: 'coin_limit',
        });
      }
    },
  });

  const transactionFee = useMemo(
    () => resolveTransactionCosts.data?.fee.format(),
    [resolveTransactionCosts.data],
  );

  const assets = useMemo(
    () =>
      props?.assets?.map((asset) => ({
        amount: asset.amount!,
        assetId: asset.assetId,
      })),
    [props?.assets],
  );

  const { transactionsFields, form } = useCreateTransactionForm({
    assets,
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
        title: 'Transaction creation failed',
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

  const currentFieldAmountWithoutCommas = currentFieldAmount
    ? currentFieldAmount.replace(/,/g, '')
    : '';

  const currentFieldAsset = form.watch(`transactions.${accordion.index}.asset`);

  const transactionTotalAmount = form
    .watch('transactions')
    ?.reduce((acc, t) => acc.add(bn.parseUnits(t.amount)), bn(0))
    ?.format();
  const transactionAssetsTotalAmount = form
    .watch('transactions')
    ?.reduce((acc, tx) => {
      const { asset, amount } = tx;
      const amountWithoutCommas = amount.replace(/,/g, '');
      if (!acc[asset]) {
        acc[asset] = bn.parseUnits(amountWithoutCommas);
      } else {
        acc[asset] = acc[asset].add(bn.parseUnits(amountWithoutCommas));
      }

      return acc;
    }, {} as IAssetGroupById);

  const formattedCurrentAssetBalance = useGetTokenInfosArray(
    currentVaultAssets ?? [],
    assetsMap,
  );

  const getBalanceAvailable = useCallback(
    (assetId?: string) => {
      const assetToCheck = assetId ?? currentFieldAsset;

      const currentAssetBalance = bn.parseUnits(
        formattedCurrentAssetBalance?.find(
          (asset) => asset.assetId === assetToCheck,
        )?.amount ?? '0',
      );

      const currentAssetAmount =
        transactionAssetsTotalAmount?.[assetToCheck] ?? bn(0);

      const assetFieldsAmount = currentAssetAmount.gt(0)
        ? currentAssetAmount.sub(bn.parseUnits(currentFieldAmountWithoutCommas))
        : currentAssetAmount;

      const balanceAvailableWithoutFee = assetFieldsAmount.gte(
        currentAssetBalance,
      )
        ? bn(0)
        : currentAssetBalance.sub(assetFieldsAmount);

      const isEthTransaction = assetToCheck === NativeAssetId;
      const isNFT = !!props?.nfts?.find((nft) => nft.assetId === assetToCheck);
      const transactionFee = bn.parseUnits(validTransactionFee ?? '0');

      let balanceAvailable = '0.000';

      if (isEthTransaction && balanceAvailableWithoutFee.gte(transactionFee)) {
        balanceAvailable = balanceAvailableWithoutFee
          .sub(transactionFee)
          .format();
      }

      if (!isEthTransaction) {
        balanceAvailable = isNFT
          ? bn(1)?.format({ units: -9, precision: 0 })
          : balanceAvailableWithoutFee.format();
      }

      return balanceAvailable;
    },
    [
      currentFieldAmount,
      validTransactionFee,
      transactionAssetsTotalAmount,
      currentVaultAssets,
    ],
  );

  const handleClose = () => {
    props?.onClose?.({ open: false });
  };

  const transactionsForm = useWatch({
    control: form.control,
    name: 'transactions',
    defaultValue: [],
  });

  const allAssetsUsed = useMemo(() => {
    if (!transactionsForm?.length) return false;

    const transactionAssetIds = new Set(
      transactionsForm.map((transaction) => transaction.asset),
    );

    const nfts = props?.nfts || [];
    const allNftsInTransactions =
      nfts.length === 0 ||
      nfts.every((nft) => transactionAssetIds.has(nft.assetId));

    const assets = currentVaultAssets || [];

    const hasSufficientBalance = assets.every(({ assetId, units }) => {
      if (!transactionAssetIds.has(assetId)) return false;
      const available = getBalanceAvailable(assetId);
      const assetAmount = bn.parseUnits(available, units);
      const transactionAssets = (transactionsForm ?? []).filter(
        (transaction) => transaction.asset === assetId,
      );

      const totalTransactionAmount = transactionAssets.reduce(
        (sum, transaction) => {
          const amount = bn.parseUnits(
            (transaction.amount || '0').replace(/,/g, ''),
          );
          return sum.add(amount);
        },
        bn(0),
      );

      return assetAmount.lte(totalTransactionAmount);
    });

    const hasBalance = allNftsInTransactions && hasSufficientBalance;

    return hasBalance;
  }, [currentVaultAssets, getBalanceAvailable, props?.nfts, transactionsForm]);

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

  const debouncedResolveTransactionCosts = useCallback(
    debounce(async (assets, vault) => {
      await resolveTransactionCosts.mutateAsync({ assets, vault, assetsMap });
    }, 300),
    [],
  );

  useEffect(() => {
    if (
      (currentFieldAsset && !currentFieldAmount) ||
      Number(currentFieldAmount) === 0
    )
      return;

    const transactions = form.getValues('transactions');

    const startsWithZeroDecimal = (amount: string) => /^0\.\d+$/.test(amount);

    const formatAmount = (amount: string, units: number) => {
      try {
        const sanitizedAmount = amount.replace(/(?<=\d),(?=\d{3})/g, '');

        if (startsWithZeroDecimal(sanitizedAmount)) return sanitizedAmount;

        let floatAmount = parseFloat(sanitizedAmount);
        if (isNaN(floatAmount)) throw new Error(`Invalid Value: ${amount}`);

        if (floatAmount >= 100) {
          floatAmount = Math.floor(floatAmount);
        }

        return bn(floatAmount.toString()).formatUnits(units).replace(/,/g, '');
      } catch (error) {
        return amount;
      }
    };

    const processTransactions = (transactions: any[]) =>
      transactions
        .map(({ amount, value, asset }) => {
          const decimals = assetsMap?.[asset]?.units ?? 9;
          const formattedAmount = formatAmount(amount, decimals);

          return {
            to: value || recipientMock,
            amount: formattedAmount,
            assetId: asset,
          };
        })
        .filter(({ amount }) => Number(amount) > 0);

    const assets =
      Number(transactionTotalAmount?.replace(/,/g, '')) > 0
        ? processTransactions(transactions!)
        : processTransactions(
            currentVaultAssets?.map(({ amount, assetId }) => ({
              amount: amount || '0',
              asset: assetId,
              value: recipientMock,
            })) || [],
          );

    debouncedResolveTransactionCosts(assets, vault!);
  }, [
    transactionTotalAmount,
    currentVaultAssets,
    currentFieldAsset,
    currentFieldAmount,
    debouncedResolveTransactionCosts,
    form,
    vault,
  ]);

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
      allAssetsUsed,
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
