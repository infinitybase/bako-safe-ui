import { Button, Flex, Stack } from 'bako-ui';
import { Vault } from 'bakosafe';
import { BN, bn } from 'fuels';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { DEFAULT_SLIPPAGE, SwapButtonTitle } from '@/config/swap';
import {
  Asset,
  FUEL_ASSET_ID,
  FUEL_TESTNET_ASSET_ID,
  getChainId,
  NativeAssetId,
  useContactToast,
} from '@/modules';
import { useTransactionsContext } from '@/modules/transactions/providers/TransactionsProvider';
import { formatMaxDecimals } from '@/utils';

import {
  useBakoAmm,
  useSwap,
  useSwapData,
  useSwapPreview,
} from '../../hooks/swap';
import { useAvailableEthBalance } from '../../hooks/swap/useAvailableEthBalance';
import { useMira } from '../../hooks/swap/useMira';
import { State } from '../../hooks/swap/useSwapRouter';
import { CoinBox } from './CoinBox';
import { SwapCost } from './SwapCost';
import { SwapDivider } from './SwapDivider';
import { SwapError } from './SwapError';

export type SwapState = {
  from: Asset;
  to: Asset;
  fee?: BN;
  status: 'idle' | 'preview' | 'error';
};

const DEFAULT_FUEL_ASSET: Asset = {
  assetId: FUEL_ASSET_ID,
  amount: '',
  name: 'Fuel',
  units: 9,
  icon: 'https://verified-assets.fuel.network/images/fuel.svg',
  slug: 'FUEL',
};

const DEFAULT_ETH_ASSET: Asset = {
  assetId: NativeAssetId,
  amount: '',
  name: 'Ethereum',
  units: 9,
  icon: 'https://verified-assets.fuel.network/images/eth.svg',
  slug: 'ETH',
};

export type SwapMode = 'buy' | 'sell' | 'idle';

interface RootSwapProps {
  assets: (Asset & { balance: BN | null })[];
  vault?: Vault;
  isLoadingAssets?: boolean;
  networkUrl?: string;
}

const MAINNET_NETWORK = import.meta.env.VITE_MAINNET_NETWORK;

export const RootSwap = memo(
  ({
    assets,
    vault,
    isLoadingAssets,
    networkUrl = MAINNET_NETWORK,
  }: RootSwapProps) => {
    const [swapMode, setSwapMode] = useState<SwapMode>('idle');
    const [swapButtonTitle, setSwapButtonTitle] = useState<SwapButtonTitle>(
      SwapButtonTitle.PREVIEW,
    );
    const { successToast, errorToast } = useContactToast();
    const amm = useMira({ vault });
    const isTestnet = getChainId() === 0;
    const { isPendingSigner } = useTransactionsContext();

    const [swapState, setSwapState] = useState<SwapState>({
      from: DEFAULT_ETH_ASSET,
      to: isTestnet
        ? { ...DEFAULT_FUEL_ASSET, assetId: FUEL_TESTNET_ASSET_ID }
        : DEFAULT_FUEL_ASSET,
      status: 'idle',
    });

    const availableEthBalance = useAvailableEthBalance(swapState.from, assets);
    const bakoAmm = useBakoAmm(vault);

    const { trade } = useSwapPreview(swapState, swapMode, networkUrl);

    const pools = useMemo(
      () => trade?.bestRoute?.pools.map((pool) => pool.poolId) || [],
      [trade],
    );

    const isLoading = useMemo(
      () => trade.state === State.LOADING,
      [trade.state],
    );
    const isNoRoute = useMemo(
      () => trade.state === State.NO_ROUTES,
      [trade.state],
    );

    const {
      swapData,
      getSwapPreview,
      isPending: isLoadingPreview,
    } = useSwapData({ amm, vault, pools, bakoAmm, networkUrl });

    const { sendTx, isPending: isSendingTx } = useSwap();

    const handleResetAmounts = useCallback(() => {
      setSwapMode('idle');
      setSwapState((prevState) => ({
        ...prevState,
        from: {
          ...prevState.from,
          amount: '',
        },
        to: {
          ...prevState.to,
          amount: '',
        },
      }));
      setSwapButtonTitle(SwapButtonTitle.PREVIEW);
    }, []);

    const handleSubmitSwap = useCallback(async () => {
      if (swapState.status === 'idle') {
        const preview = await getSwapPreview({
          state: swapState,
          mode: swapMode,
          slippage: DEFAULT_SLIPPAGE,
        });
        setSwapState((prevState) => ({
          ...prevState,
          status: 'preview',
          fee: preview.bakoFee,
        }));
        setSwapButtonTitle(SwapButtonTitle.SWAP);
      }
      if (swapState.status !== 'idle' && swapData?.request) {
        await sendTx({
          vault,
          tx: swapData.request,
          assetIn: swapState.from.slug,
          assetOut: swapState.to.slug,
        })
          .then(() => {
            successToast({ description: 'Swap transaction sent successfully' });
            handleResetAmounts();
          })
          .catch((e) => {
            const errorMessage = String(e);

            if (errorMessage.includes('InsufficientFeeAmount')) {
              errorToast({
                title: 'Insufficient Fee',
                description: 'Bridge more ETH to complete this transaction.',
              });
            } else {
              errorToast({
                title: 'Swap Error',
                description:
                  'Error on try to send transaction, try again later',
              });
            }
            setSwapState((prevState) => ({
              ...prevState,
              status: 'error',
            }));
          });
      }
    }, [
      getSwapPreview,
      swapMode,
      swapState,
      swapData,
      sendTx,
      vault,
      successToast,
      errorToast,
      handleResetAmounts,
    ]);

    const handleSwapModeChange = useCallback(
      (mode: SwapMode) => {
        if (swapMode !== mode) {
          setSwapMode(mode);
        }
      },
      [swapMode],
    );

    const handleCheckBalance = useCallback(
      (amount: string, assetId: string) => {
        const asset = assets.find((asset) => asset.assetId === assetId);

        if (asset && asset.balance) {
          const coinAmount = formatMaxDecimals(amount, asset.units);
          const assetAmount = bn.parseUnits(coinAmount, asset.units);

          const isBalanceSufficient = asset.balance.gte(assetAmount);

          if (isBalanceSufficient) {
            return setSwapButtonTitle(SwapButtonTitle.PREVIEW);
          }
        }
        if (swapButtonTitle !== SwapButtonTitle.INSUFFICIENT_BALANCE) {
          setSwapButtonTitle(SwapButtonTitle.INSUFFICIENT_BALANCE);
        }
      },
      [assets, setSwapButtonTitle, swapButtonTitle],
    );

    const handleFromAssetSelect = useCallback(
      (assetId: string) => {
        const selectedAsset = assets.find((asset) => asset.assetId === assetId);
        const isSameAsset = selectedAsset?.assetId === swapState.to.assetId;
        if (selectedAsset) {
          handleSwapModeChange('sell');
          setSwapState((prevState) => ({
            ...prevState,
            to: isSameAsset ? prevState.from : prevState.to,
            from: {
              ...selectedAsset,
              amount: prevState.from.amount || '',
            },
            status: 'idle',
          }));
        }
        handleCheckBalance(swapState.from.amount || '0', assetId);
      },
      [assets, swapState, handleSwapModeChange, handleCheckBalance],
    );

    const handleToAssetSelect = useCallback(
      (assetId: string) => {
        const selectedAsset = assets.find((asset) => asset.assetId === assetId);
        const isSameAsset = selectedAsset?.assetId === swapState.from.assetId;
        if (selectedAsset) {
          handleSwapModeChange('sell');
          setSwapState((prevState) => ({
            ...prevState,
            from: isSameAsset ? prevState.to : prevState.from,
            to: {
              ...selectedAsset,
              amount: prevState.to.amount || '',
            },
            status: 'idle',
          }));
        }
      },
      [assets, swapState, handleSwapModeChange],
    );

    const handleChangeAssetAmount = useCallback(
      (mode: SwapMode, value: string) => {
        const normalizedValue = value === '0' ? '0.' : value;

        setSwapState((prevState) => {
          const stateMode = mode === 'sell' ? 'from' : 'to';
          const updatedAsset = prevState[stateMode];
          const otherKey = stateMode === 'from' ? 'to' : 'from';
          const otherAsset = prevState[otherKey];
          handleSwapModeChange(mode);
          if (mode === 'sell') {
            handleCheckBalance(normalizedValue, updatedAsset.assetId);
          }
          return {
            ...prevState,
            status: 'idle',
            [stateMode]: {
              ...updatedAsset,
              amount: normalizedValue,
            },
            [otherKey]: {
              ...otherAsset,
              amount: '',
            },
          };
        });
      },
      [handleSwapModeChange, handleCheckBalance],
    );
    const handleSwapAssets = useCallback(() => {
      if (swapState.to.amount && swapState.to.amount !== '0') {
        handleCheckBalance(swapState.to.amount, swapState.to.assetId);
      }
      setSwapState((prevState) => ({
        ...prevState,
        from: prevState.to,
        to: prevState.from,
      }));
    }, [handleCheckBalance, swapState.to]);

    const handleUpdateAmountOut = useCallback(
      (amount: string) => {
        if (swapState.to.amount === amount) return;

        setSwapState((prevState) => ({
          ...prevState,
          to: {
            ...prevState.to,
            amount,
          },
        }));
      },
      [swapState.to.amount],
    );

    const handleUpdateAmountIn = useCallback(
      (amount: string) => {
        if (swapState.from.amount === amount) return;

        setSwapState((prevState) => ({
          ...prevState,
          from: {
            ...prevState.from,
            amount,
          },
        }));

        if (swapMode === 'buy') {
          handleCheckBalance(amount, swapState.from.assetId);
        }
      },
      [
        swapState.from.amount,
        handleCheckBalance,
        swapState.from.assetId,
        swapMode,
      ],
    );

    const handleClearAmount = useCallback(
      (mode: SwapMode) => {
        if (mode === 'sell') {
          const amountTo = swapState.to.amount;

          if (amountTo === '0') return;
          setSwapState((prevState) => ({
            ...prevState,
            to: {
              ...prevState.to,
              amount: '0',
            },
          }));
          return;
        }

        const amountFrom = swapState.from.amount;

        if (amountFrom === '0') return;
        setSwapState((prevState) => ({
          ...prevState,
          from: {
            ...prevState.from,
            amount: '0',
          },
        }));
      },
      [swapState.from.amount, swapState.to.amount],
    );

    useEffect(() => {
      if (
        trade &&
        trade.state === State.VALID &&
        (trade.amountIn || trade.amountOut)
      ) {
        const isSellMode = swapMode === 'sell';
        const amount = isSellMode ? trade.amountOut : trade.amountIn;
        const units = isSellMode ? swapState.to.units : swapState.from.units;
        const formattedAmount = amount.formatUnits(units);
        if (isSellMode) {
          handleUpdateAmountOut(formattedAmount);
        } else {
          handleUpdateAmountIn(formattedAmount);
        }
      }

      const noTradeAmount =
        trade?.amountIn?.eq(0) ||
        !trade.amountIn ||
        trade?.amountOut?.eq(0) ||
        !trade.amountOut;

      if (trade && trade.state === State.IDLE && noTradeAmount) {
        handleClearAmount(swapMode);
      }
    }, [
      trade,
      swapMode,
      handleUpdateAmountIn,
      handleUpdateAmountOut,
      handleClearAmount,
      swapState.from.units,
      swapState.to.units,
    ]);

    const isEmptyAmounts = useMemo(
      () =>
        bn.parseUnits(swapState.from.amount ?? '0').lte(bn(0)) ||
        bn.parseUnits(swapState.to.amount ?? '0').lte(bn(0)),
      [swapState.from.amount, swapState.to.amount],
    );

    const isEmptyAssets = useMemo(
      () =>
        !swapState.from.assetId ||
        !swapState.to.assetId ||
        swapState.from.assetId === swapState.to.assetId,
      [swapState.from.assetId, swapState.to.assetId],
    );

    const isPendingTransaction = useMemo(
      () => swapButtonTitle === SwapButtonTitle.PENDING_TRANSACTION,
      [swapButtonTitle],
    );

    const isInsufficientBalance = useMemo(
      () => swapButtonTitle === SwapButtonTitle.INSUFFICIENT_BALANCE,
      [swapButtonTitle],
    );

    const isInsufficientETHBalance = useMemo(
      () => swapButtonTitle === SwapButtonTitle.INSUFFICIENT_ETH_BALANCE,
      [swapButtonTitle],
    );

    useEffect(() => {
      if (
        !availableEthBalance &&
        !isInsufficientBalance &&
        (Number(swapState.to.amount) > 0 || Number(swapState.from.amount) > 0)
      ) {
        setSwapButtonTitle(SwapButtonTitle.INSUFFICIENT_ETH_BALANCE);
      }
    }, [
      availableEthBalance,
      swapState.to,
      swapState.from,
      isInsufficientBalance,
    ]);

    useEffect(() => {
      if (
        isPendingSigner &&
        swapButtonTitle !== SwapButtonTitle.PENDING_TRANSACTION
      ) {
        setSwapButtonTitle(SwapButtonTitle.PENDING_TRANSACTION);
      }
      if (
        !isPendingSigner &&
        swapButtonTitle === SwapButtonTitle.PENDING_TRANSACTION &&
        swapMode === 'idle'
      ) {
        setSwapButtonTitle(SwapButtonTitle.PREVIEW);
      }
    }, [isPendingSigner, swapButtonTitle, swapMode]);

    return (
      <Stack gap={1}>
        <CoinBox
          mode="sell"
          coin={swapState.from}
          onChangeAsset={handleFromAssetSelect}
          assets={assets}
          onChangeAmount={(value) => handleChangeAssetAmount('sell', value)}
          isLoadingAmount={isLoading && swapMode === 'buy'}
          isLoadingAssets={isLoadingAssets}
          isLoadingPreview={isLoadingPreview}
        />

        <SwapDivider onSwap={handleSwapAssets} />

        <CoinBox
          mode="buy"
          coin={swapState.to}
          onChangeAsset={handleToAssetSelect}
          assets={assets}
          onChangeAmount={(value) => handleChangeAssetAmount('buy', value)}
          isLoadingAmount={isLoading && swapMode === 'sell'}
          isLoadingAssets={isLoadingAssets}
          isLoadingPreview={isLoadingPreview}
        />

        {trade.error && <SwapError error={trade.error} />}

        {swapButtonTitle === SwapButtonTitle.SWAP && (
          <SwapCost
            isLoadingCost={isLoadingPreview || isLoading}
            pools={pools}
            txCost={swapData?.tx}
            swapState={swapState}
            mode={swapMode}
          />
        )}

        <Flex alignItems="center" mt={4}>
          <Button
            w="full"
            colorPalette="primary"
            disabled={
              isEmptyAmounts ||
              isEmptyAssets ||
              isInsufficientBalance ||
              isPendingTransaction ||
              isInsufficientETHBalance ||
              isNoRoute
            }
            loading={isLoadingPreview || isSendingTx || isLoading}
            onClick={handleSubmitSwap}
          >
            {swapButtonTitle}
          </Button>
        </Flex>
      </Stack>
    );
  },
);

RootSwap.displayName = 'RootSwap';
