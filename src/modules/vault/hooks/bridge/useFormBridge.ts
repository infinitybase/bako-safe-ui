import { AxiosError } from 'axios';
import {
  bn,
  hashMessage,
  randomBytes,
  TransactionRequest,
  transactionRequestify,
} from 'fuels';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ICreateSwapBridgePayload,
  ICreateSwapBridgeResponse,
  IGetDestinationsResponse,
  IInfoBridgeSwapPayload,
  IQuoteFormLayersSwap,
  useBakoSafeVault,
} from '@/modules/core';
import { useNetworks } from '@/modules/network/hooks';
import { availableNetWorks, NetworkType } from '@/modules/network/services';
import { useTransactionToast } from '@/modules/transactions/providers/toast';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

import { AssetItem } from '../../components/bridge';
import {
  AssetFormItem,
  useFormBridgeContext,
} from '../../components/bridge/providers/FormBridgeProvider';
import {
  BridgeStepsForm,
  ErrorBridgeForm,
  formatEstimativeTime,
  optionsAssetsFuel,
} from '../../components/bridge/utils';
import { useVaultInfosContext } from '../../hooks';
import { useCreateSwapBridge } from './useCreateSwapBridge';
import { useCreateBridgeTransaction } from './useCreateTransactionBridge';
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
    pendingSignerTransactions,
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
    setStepForm,
    isSendingTx,
    setIsSendingTx,
  } = useFormBridgeContext();
  const { watch } = form;
  const toast = useTransactionToast();
  const { assets } = useVaultInfosContext();
  const { createSwapBridgeAsync, isPending } = useCreateSwapBridge();
  const { createTransactionBridgeAsync } = useCreateBridgeTransaction();
  const { getDestinationsBridgeAsync, isPending: isLoadingDestinations } =
    useGetDestinationsBridge();
  const { getLimitsBridgeAsync } = useGetLimitsBridge();
  const { getQuoteBridgeAsync } = useGetQuoteBridge();
  const [toAssetOptions, setToAssetOptions] = useState<AssetFormItem[]>([]);

  const assetFromValue = watch('selectAssetFrom');
  const assetToValue = watch('selectAssetTo');
  const networkToValueForm = watch('selectNetworkTo');
  const destinationAddress = watch('destinationAddress');
  const amount = watch('amount');

  const assetFrom = useMemo(
    () => optionsAssetsFuel.find((a) => a.value === assetFromValue) ?? null,
    [assetFromValue],
  );

  const networkTo = useMemo(() => {
    const value = networkToValueForm?.value;

    const foundOption = toNetworkOptions.find((a) => a.value === value);

    return foundOption ?? null;
  }, [toNetworkOptions, networkToValueForm]);

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
      return assetToValue;
    }, [assetToValue]) ?? null;

  const isFormComplete = useMemo(() => {
    const amountTreated = Number(amount.replace(/,/g, ''));

    return (
      !!assetFromValue &&
      !!networkToValueForm &&
      !!destinationAddress &&
      !!assetToValue &&
      amountTreated > 0
    );
  }, [
    assetFromValue,
    assetToValue,
    amount,
    networkToValueForm,
    destinationAddress,
  ]);

  const handleGetToNetworkOptions = useCallback(
    (data: IGetDestinationsResponse[]) => {
      if (!data || data.length === 0) return;

      const options: AssetFormItem[] = data.map((item) => ({
        id: item.name.replace(/\s+/g, '_').toLowerCase(),
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
      if (!assetFrom) return;

      const isMainnet =
        currentNetwork.url === availableNetWorks[NetworkType.MAINNET].url;

      const data = await getDestinationsBridgeAsync({
        fromNetwork: isMainnet ? 'FUEL_MAINNET' : 'FUEL_TESTNET',
        fromToken: assetFrom.symbol || '',
      });

      handleGetToNetworkOptions(data);
    },
    [currentNetwork.url, getDestinationsBridgeAsync, handleGetToNetworkOptions],
  );

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
        id: hashMessage(token.symbol),
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
        sourceToken: (assetFrom?.symbol || assetFrom?.name) ?? '',
        destinationNetwork: networkToValueForm?.value ?? '',
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

        saveQuote({
          quote: {
            ...data.quote,
            avgCompletionTime: formatEstimativeTime(
              data.quote.avgCompletionTime,
            ),
          },
          receiveInUsd: '-',
        });
        if (ErrorBridgeForm.QUOTE) saveErrorForm(null);
        setTimeout(() => {
          setLoadingQuote(false);
        }, 1000);

        return data;
      } catch (error) {
        setLoadingQuote(false);
        saveQuote({} as IQuoteFormLayersSwap);
        saveErrorForm(ErrorBridgeForm.QUOTE);
      }
    },
    [
      amount,
      getQuoteBridgeAsync,
      prepareCreateSwapPayload,
      saveQuote,
      saveErrorForm,
      setLoadingQuote,
    ],
  );

  const sendTx = useCallback(
    async (tx: TransactionRequest, swapResponse: ICreateSwapBridgeResponse) => {
      try {
        if (!vault) return;

        const txData = await vault.prepareTransaction(tx);

        const swapInfo: IInfoBridgeSwapPayload = {
          swap: swapResponse,
          sourceAddress: predicateAddress,
          sourceAsset: assetFrom?.value ?? '',
          destinationAsset: assetTo?.value ?? '',
        };

        const transaction = await createTransactionBridgeAsync({
          txData,
          swap: swapInfo,
          name: `Bridge Fuel Network to ${networkTo?.name}`,
        });

        await confirmTransaction(
          transaction.id,
          undefined,
          transaction,
        ).finally(async () => {
          await refetchVaultTransactionsList();
          await refetchTransactionsList();
          await refetchHomeTransactionsList();
          await pendingSignerTransactions.refetch();
        });
        form.reset();
        setStepForm(BridgeStepsForm.FROM);
      } catch (error) {
        console.info('error sendtx bridge', error);
      }
    },
    [
      networkTo,
      vault,
      assetFrom?.value,
      assetTo?.value,
      predicateAddress,
      confirmTransaction,
      refetchHomeTransactionsList,
      refetchTransactionsList,
      refetchVaultTransactionsList,
      createTransactionBridgeAsync,
      pendingSignerTransactions,
      form,
      setStepForm,
    ],
  );

  const onSubmit = form.handleSubmit(async () => {
    try {
      setIsSendingTx(true);

      const payload = await prepareCreateSwapPayload();

      const response = await createSwapBridgeAsync(payload);

      const depositActions = response.depositActions[0];
      const callData = JSON.parse(depositActions.callData);

      const tx = transactionRequestify(callData.script);
      if (!payload?.sourceAddress) {
        toast.error(
          'Please, check the address corresponding the source network.',
        );
        setIsSendingTx(false);
        return;
      }

      if (!vault) {
        toast.error('Internal error occurred. Please, try again later.');
        setIsSendingTx(false);
        return;
      }

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
      await sendTx(tx, response);
    } catch (err) {
      console.info('error submit brigde', err);
      if (
        err instanceof AxiosError &&
        err?.response?.data?.title.includes('Invalid address')
      ) {
        toast.generalError(
          randomBytes.toString(),
          'Invalid destination address',
          'Please, check the address corresponding the destination network.',
        );
      }
    } finally {
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
    isLoadingDestinations: isLoadingDestinations || assets.isLoading,
    isLoadingQuote,
    isSendingTx,
    errorForm,
    setLoadingQuote,
    getDestinations,
    getOperationLimits,
    getOperationQuotes,
    prepareCreateSwapPayload,
    onSubmit,
  };
};

export { useFormBridge };
