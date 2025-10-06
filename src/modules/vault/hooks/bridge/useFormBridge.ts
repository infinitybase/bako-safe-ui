import { AxiosError } from 'axios';
import { TransactionStatus } from 'bakosafe';
import {
  bn,
  randomBytes,
  TransactionRequest,
  transactionRequestify,
} from 'fuels';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ICreateSwapBridgePayload,
  IGetDestinationsResponse,
  IQuoteFormLayersSwap,
  useBakoSafeVault,
  useScreenSize,
} from '@/modules/core';
import { tokensIDS } from '@/modules/core/utils/assets/address';
import { useNetworks } from '@/modules/network/hooks';
import { availableNetWorks, NetworkType } from '@/modules/network/services';
import { useTransactionToast } from '@/modules/transactions/providers/toast';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { TransactionService } from '@/modules/transactions/services';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { AssetItem } from '../../components/bridge';
import {
  AssetFormItem,
  useFormBridgeContext,
} from '../../components/bridge/providers/FormBridgeProvider';
import {
  ErrorBridgeForm,
  formatEstimativeTime,
  optionsAssetsFuel,
} from '../../components/bridge/utils';
import { useVaultInfosContext } from '../../VaultInfosProvider';
import { useCreateSwapBridge } from './useCreateSwapBridge';
import { useGetDestinationsBridge } from './useGetDestinationsBridge';
import { useGetLimitsBridge } from './useGetLimits';
import { useGetQuoteBridge } from './useGetQuoteBridge';

const useFormBridge = () => {
  const {
    tokensUSD,
    assetsMap,
    vaultDetails: {
      vaultRequest: {
        data: { predicateAddress, provider, id },
      },
    },
  } = useWorkspaceContext();
  const { currentNetwork } = useNetworks();
  const {
    isPendingSigner,
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

  const { vault } = useBakoSafeVault({
    address: predicateAddress,
    provider,
    id,
  });

  const {
    form,
    dataQuote,
    dataLimits,
    isLoadingQuote,
    errorForm,
    toNetworkOptions,
    saveQuote,
    setLoadingQuote,
    saveLimits,
    saveErrorForm,
    saveToNetworkOptions,
  } = useFormBridgeContext();
  const { watch } = form;
  const toast = useTransactionToast();
  const { assets } = useVaultInfosContext();
  const { isMobile } = useScreenSize();
  const { createSwapBridgeAsync, isPending } = useCreateSwapBridge();
  const { getDestinationsBridgeAsync, isPending: isLoadingDestinations } =
    useGetDestinationsBridge();
  const { getLimitsBridgeAsync } = useGetLimitsBridge();
  const { getQuoteBridgeAsync, isPending: isPendingQuote } =
    useGetQuoteBridge();
  const [toAssetOptions, setToAssetOptions] = useState<AssetFormItem[]>([]);
  const [isSendingTx, setIsSendingTx] = useState<boolean>(false);

  const assetFromValue = watch('selectAssetFrom');
  const assetToValue = watch('selectAssetTo');
  const assetToMobile = watch('selectAssetToMobile');
  const networkToMobile = watch('selectNetworkToMobile');
  const networkToValueForm = watch('selectNetworkTo');
  const destinationAddress = watch('destinationAddress');
  const amount = watch('amount');

  useEffect(() => {
    if (isPendingQuote !== isLoadingQuote) {
      setLoadingQuote(isPendingQuote);
    }
  }, [isPendingQuote]);

  const assetFrom =
    useMemo(
      () => optionsAssetsFuel.find((a) => a.value === assetFromValue),
      [assetFromValue],
    ) ?? null;

  const networkTo = useMemo(() => {
    const value = isMobile ? networkToMobile : networkToValueForm?.value;

    const foundOption = toNetworkOptions.find((a) => a.value === value);

    return foundOption ?? null;
  }, [isMobile, toNetworkOptions, networkToValueForm, networkToMobile]);

  const assetFromUSD = useMemo(() => {
    if (!amount || amount === '0') return '$0';

    if (!assetFrom) return '$0';

    const usdData = tokensUSD.data[assetFrom.value];
    const usdAmount = usdData?.usdAmount ?? null;

    const txAmount = Number(amount.replace(/,/g, '')) * (usdAmount ?? 0);

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(txAmount);
  }, [amount, assetFrom, tokensUSD.data]);

  const assetTo =
    useMemo(() => {
      if (!isMobile) return assetToValue;
      const assettOFinded = toAssetOptions.find(
        (a) => a.value === assetToMobile,
      );
      return assettOFinded;
    }, [assetToMobile, assetToValue, isMobile, toAssetOptions]) ?? null;

  const isFormComplete = useMemo(() => {
    const amountTreated = Number(amount.replace(/,/g, ''));

    return (
      !!assetFromValue &&
      (!!networkToValueForm || !!networkToMobile) &&
      !!destinationAddress &&
      (!!assetToValue || !!assetToMobile) &&
      amountTreated > 0
    );
  }, [
    assetFromValue,
    assetToValue,
    assetToMobile,
    networkToMobile,
    amount,
    networkToValueForm,
    destinationAddress,
  ]);

  const handleGetToNetworkOptions = useCallback(
    (data: IGetDestinationsResponse[]) => {
      if (!data || data.length === 0) return;

      const options: AssetFormItem[] = data.map((item) => ({
        value: item.name,
        image: item.logo,
        name: item.displayName,
        symbol: null,
        tokens: item.tokens,
      }));

      saveToNetworkOptions(options);
    },
    [saveToNetworkOptions],
  );

  const getDestinations = useCallback(
    async (assetFrom?: AssetItem) => {
      if (!assetFrom?.name) return;

      const isMainnet =
        currentNetwork.url === availableNetWorks[NetworkType.MAINNET].url;

      const data = await getDestinationsBridgeAsync({
        fromNetwork: isMainnet ? 'FUEL_MAINNET' : 'FUEL_TESTNET',
        fromToken: assetFrom?.name ?? '',
      });

      handleGetToNetworkOptions(data);
    },
    [currentNetwork.url, getDestinationsBridgeAsync, handleGetToNetworkOptions],
  );

  useEffect(() => {
    if ((!assetFromValue || assetFromValue === '') && isMobile) {
      form.setValue('selectAssetFrom', tokensIDS.ETH);
      const AssetItem = {
        value: tokensIDS.ETH,
        image: 'ETH',
        name: 'ETH',
        symbol: 'ETH',
      };

      getDestinations(AssetItem);
    }
  }, [assetFromValue, isMobile, form, getDestinations]);

  const getToAssetsOptions = useCallback(() => {
    const tokensNetwork = toNetworkOptions.find(
      (item) => item.value === networkTo?.value,
    );
    if (!tokensNetwork || !tokensNetwork.tokens) return;

    const options: AssetFormItem[] = [];

    tokensNetwork.tokens.forEach((token) => {
      const assetMapped = Object.values(assetsMap).find(
        (asset) => asset.slug === token.symbol,
      );

      const assetId = assetMapped?.assetId ?? '';
      const asset = assets?.assets?.find((asset) => asset.assetId === assetId);
      const balance =
        bn(asset?.amount)
          ?.format({
            units: assetMapped?.units,
          })
          .replace(/,/g, '') ?? '';

      options.push({
        value: assetId,
        image: token.logo,
        name: assetMapped?.name || token.symbol,
        balance,
        symbol: token.symbol,
      });
    });

    setToAssetOptions(options);
  }, [networkTo?.value, toNetworkOptions, assets.assets, assetsMap]);

  useEffect(() => {
    const getAssetOptions = async () => {
      await getToAssetsOptions();
    };
    getAssetOptions();
  }, [
    networkTo?.value,
    toNetworkOptions,
    assets.assets,
    assetsMap,
    assetToMobile,
    assetToValue,
    getToAssetsOptions,
    form,
  ]);

  const prepareCreateSwapPayload = useCallback(
    (assetToOverride?: AssetItem): ICreateSwapBridgePayload => {
      const finalAssetTo = assetToOverride ?? assetTo;
      const isMainnet =
        currentNetwork.url === availableNetWorks[NetworkType.MAINNET].url;

      const payload = {
        destinationAddress: destinationAddress,
        sourceNetwork: isMainnet ? 'FUEL_MAINNET' : 'FUEL_TESTNET',
        sourceToken: assetFrom?.name ?? '',
        destinationNetwork: isMobile
          ? networkToMobile
          : (networkToValueForm?.value ?? ''),
        destinationToken: finalAssetTo?.symbol ?? '',
        amount: Number(amount?.replace(/,/g, '')) || 0,
        sourceAddress: vault?.address.toString(),
        refuel: false,
        useDepositAddress: false,
        useNewDepositAddress: null,
        referenceId: null,
        slippage: null,
      };

      return payload;
    },
    [
      assetFrom?.name,
      assetTo,
      amount,
      vault,
      destinationAddress,
      networkToMobile,
      isMobile,
      networkToValueForm?.value,
      currentNetwork.url,
    ],
  );

  const getOperationLimits = useCallback(
    async (assetToOverride?: AssetItem) => {
      const payload = await prepareCreateSwapPayload(assetToOverride);
      const data = await getLimitsBridgeAsync(payload);
      saveLimits(data);
      return data;
    },
    [getLimitsBridgeAsync, prepareCreateSwapPayload, saveLimits],
  );

  const getReceiveQuoteMobile = useCallback(() => {
    if (assetFromValue && isMobile) {
      const usdData = tokensUSD.data[assetFromValue];
      const usdAmount = usdData?.usdAmount ?? null;

      const receiveValue = usdAmount * dataQuote?.quote?.receiveAmount;

      const receiveInUsd = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(receiveValue);

      saveQuote({
        ...dataQuote,
        receiveInUsd,
      });
    }
  }, [isMobile, assetFromValue, tokensUSD.data, dataQuote, saveQuote]);

  const getOperationQuotes = useCallback(
    async (amountForm = '0', payloadOverride?: ICreateSwapBridgePayload) => {
      const amountData = Number(amountForm) > 0 ? amountForm : amount;
      const amountTreated = Number(amountData.replace(/,/g, ''));

      if (amountTreated <= 0) return;

      let payload = payloadOverride
        ? payloadOverride
        : await prepareCreateSwapPayload();

      payload = {
        ...payload,
        amount: amountTreated,
      };

      try {
        const data = await getQuoteBridgeAsync(payload);
        let receiveInUsd = '-';

        if (assetFrom?.value) {
          const usdData = tokensUSD.data[assetFrom?.value];
          const usdAmount = usdData?.usdAmount ?? null;

          const receiveValue = usdAmount * data.quote.receiveAmount;

          receiveInUsd = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(receiveValue);
        }

        saveQuote({
          quote: {
            ...data.quote,
            avgCompletionTime: formatEstimativeTime(
              data.quote.avgCompletionTime,
            ),
          },
          receiveInUsd: receiveInUsd,
        });
        if (ErrorBridgeForm.QUOTE) saveErrorForm(null);
      } catch (error) {
        saveQuote({} as IQuoteFormLayersSwap);
        saveErrorForm(ErrorBridgeForm.QUOTE);
      }
    },
    [
      assetFrom?.value,
      tokensUSD,
      amount,
      getQuoteBridgeAsync,
      prepareCreateSwapPayload,
      saveQuote,
      saveErrorForm,
    ],
  );

  const sendTx = useCallback(
    async (tx: TransactionRequest) => {
      try {
        if (!vault) return;

        const { hashTxId } = await vault.BakoTransfer(tx, {
          name: 'Transfer Bridge',
        });

        const transaction = await TransactionService.getByHash(hashTxId, [
          TransactionStatus.AWAIT_REQUIREMENTS,
        ]);

        await confirmTransaction(
          transaction.id,
          undefined,
          transaction,
        ).finally(async () => {
          setIsSendingTx(false);
          await refetchVaultTransactionsList();
          await refetchTransactionsList();
          await refetchHomeTransactionsList();
        });
      } catch (error) {
        console.info('error sendtx bridge', error);
        setIsSendingTx(false);
      }
    },
    [
      confirmTransaction,
      refetchHomeTransactionsList,
      refetchTransactionsList,
      refetchVaultTransactionsList,
      vault,
    ],
  );

  const onSubmit = form.handleSubmit(async () => {
    setIsSendingTx(true);

    try {
      const payload = await prepareCreateSwapPayload();

      const response = await createSwapBridgeAsync(payload);

      const depositActions = response.depositActions[0];
      const callData = JSON.parse(depositActions.callData);

      const tx = transactionRequestify(callData.script);
      if (!payload?.sourceAddress) return;

      if (!vault) return;

      const add = await vault.getResourcesToSpend(
        callData.quantities.map((qtd: { assetId: string; amount: string }) => ({
          assetId: qtd.assetId,
          amount: qtd.amount,
        })),
      );

      tx.addResources(add);
      const txCost = await vault.getTransactionCost(tx);
      await vault.fund(tx, txCost);

      //tx.addCoinOutput(new Address(WALLET_BAKO), bn(175), tokensIDS.ETH);

      await sendTx(tx);
    } catch (err) {
      console.info('error submit brigde', err);
      if (
        err instanceof AxiosError &&
        err?.response?.data?.detail === 'Invalid address'
      ) {
        toast.generalError(
          randomBytes.toString(),
          'Invalid destination address',
          'Please, check the address corresponding the destination network.',
        );
      }
      setIsSendingTx(false);
    }
  });

  return {
    form,
    amount,
    assetFrom,
    assetTo,
    networkTo,
    destinationAddress,
    assetFromUSD,
    toNetworkOptions,
    toAssetOptions,
    dataQuote,
    dataLimits,
    isFormComplete,
    isPendingSigner,
    isLoading: isPending,
    isLoadingDestinations,
    isLoadingQuote,
    isSendingTx,
    errorForm,
    getDestinations,
    getOperationLimits,
    getOperationQuotes,
    prepareCreateSwapPayload,
    getReceiveQuoteMobile,
    onSubmit,
  };
};

export { useFormBridge };
