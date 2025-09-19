import { AxiosError } from 'axios';
import { TransactionStatus } from 'bakosafe';
import { Address, bn, randomBytes, ScriptTransactionRequest } from 'fuels';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
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

const WALLET_BAKO = import.meta.env.VITE_WALLET_BAKO!;

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
        name: item.display_name,
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
        from_network: isMainnet ? 'FUEL_MAINNET' : 'FUEL_TESTNET',
        from_token: assetFrom?.name ?? '',
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
    (assetToOverride?: AssetItem) => {
      const finalAssetTo = assetToOverride ?? assetTo;
      const isMainnet =
        currentNetwork.url === availableNetWorks[NetworkType.MAINNET].url;

      const payload = {
        destination_address: destinationAddress,
        source_network: isMainnet ? 'FUEL_MAINNET' : 'FUEL_TESTNET',
        source_token: assetFrom?.name ?? '',
        destination_network: isMobile
          ? networkToMobile
          : (networkToValueForm?.value ?? ''),
        destination_token: finalAssetTo?.symbol ?? '',
        amount: Number(amount?.replace(/,/g, '')) || 0,
        source_address: vault?.address.toString(),
        refuel: false,
        use_deposit_address: false,
        use_new_deposit_address: null,
        reference_id: null,
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

  const getOperationQuotes = useCallback(
    async (amountForm = '0', assetToOverride?: AssetItem) => {
      const assetToData = assetToOverride ?? assetTo;
      const amountData = Number(amountForm) > 0 ? amountForm : amount;
      const amountTreated = Number(amountData.replace(/,/g, ''));

      if (amountTreated <= 0) return;

      let payload = await prepareCreateSwapPayload();

      payload = {
        ...payload,
        amount: amountTreated,
        destination_token: assetToData?.symbol ?? '',
      };
      try {
        const data = await getQuoteBridgeAsync(payload);
        let receiveInUsd = '-';

        if (assetFrom?.value) {
          const usdData = tokensUSD.data[assetFrom?.value];
          const usdAmount = usdData?.usdAmount ?? null;

          const receiveValue = usdAmount * data.quote.receive_amount;

          receiveInUsd = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(receiveValue);
        }

        saveQuote({
          quote: {
            ...data.quote,
            avg_completion_time: formatEstimativeTime(
              data.quote.avg_completion_time,
            ),
          },
          receive_in_usd: receiveInUsd,
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
      assetTo,
      getQuoteBridgeAsync,
      prepareCreateSwapPayload,
      saveQuote,
      saveErrorForm,
    ],
  );

  const sendTx = useCallback(
    async (tx: ScriptTransactionRequest) => {
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

      const depositActions = response.deposit_actions[0];
      const callData = JSON.parse(depositActions.call_data);

      const tx = new ScriptTransactionRequest({
        gasLimit: bn(callData.script.gasLimit ?? 1_000_000),
      });
      tx.script = callData.script.script;
      tx.scriptData = callData.script.scriptData;

      const address = new Address(depositActions.to_address);

      for (const q of callData.quantities || []) {
        tx.addCoinOutput(address, bn(q.amount), q.assetId);
      }

      tx.addCoinOutput(new Address(WALLET_BAKO), bn(175), tokensIDS.ETH);

      await sendTx(tx);
    } catch (err) {
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
    onSubmit,
  };
};

export { useFormBridge };
