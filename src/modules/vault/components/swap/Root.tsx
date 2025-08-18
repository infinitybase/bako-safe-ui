import { Button, Flex, Stack } from '@chakra-ui/react';
import { Vault } from 'bakosafe';
import { BN, bn } from 'fuels';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import {
  DEFAULT_SLIPPAGE,
  MinEthValueBN,
  SwapButtonTitle,
} from '@/config/swap';
import {
  Asset,
  FUEL_ASSET_ID,
  NativeAssetId,
  useContactToast,
} from '@/modules';

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
import { GasAlert } from './GasAlert';
import { SwapCost } from './SwapCost';
import { SwapDivider } from './SwapDivider';
import { SwapError } from './SwapError';

export type SwapState = {
  from: Asset;
  to: Asset;
  fee?: BN;
  status: 'idle' | 'preview' | 'error';
};

const EMPTY_SWAP_SLOT: Asset = {
  assetId: '',
  amount: '',
  name: '',
  units: 9,
  icon: '',
  slug: '',
};

export type SwapMode = 'buy' | 'sell' | 'idle';

interface RootSwapProps {
  assets: (Asset & { balance: BN | null })[];
  vault?: Vault;
}

export const RootSwap = memo(({ assets, vault }: RootSwapProps) => {
  const [swapMode, setSwapMode] = useState<SwapMode>('idle');
  const [swapButtonTitle, setSwapButtonTitle] = useState<SwapButtonTitle>(
    SwapButtonTitle.PREVIEW,
  );
  const { successToast, errorToast } = useContactToast();
  const amm = useMira({ vault });

  const defaultFromAsset = useMemo(
    () => assets.find((asset) => asset.assetId === NativeAssetId),
    [assets],
  );
  const defaultToAsset = useMemo(
    () => assets.find((asset) => asset.assetId === FUEL_ASSET_ID),
    [assets],
  );
  const [swapState, setSwapState] = useState<SwapState>({
    from: defaultFromAsset || EMPTY_SWAP_SLOT,
    to: defaultToAsset || EMPTY_SWAP_SLOT,
    status: 'idle',
  });
  const availableEthBalance = useAvailableEthBalance(swapState.from, assets);
  const bakoAmm = useBakoAmm(vault);

  const { trade } = useSwapPreview(swapState, swapMode);

  const pools = useMemo(
    () => trade?.bestRoute?.pools.map((pool) => pool.poolId) || [],
    [trade],
  );

  const isLoading = trade.state === State.LOADING;

  const {
    swapData,
    getSwapPreview,
    isPending: isLoadingPreview,
  } = useSwapData({ amm, vault, pools, bakoAmm });

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
          setSwapButtonTitle(SwapButtonTitle.PREVIEW);
          handleResetAmounts();
        })
        .catch((err) => {
          console.error('Swap transaction errorToast:', err);
          errorToast({
            title: 'Swap Error',
            description: 'Error on try to send transaction, try again later',
          });
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
        const isEth = asset.slug === 'ETH';
        const assetAmount = isEth
          ? bn.parseUnits(amount, asset.units).add(MinEthValueBN)
          : bn.parseUnits(amount, asset.units);
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
      setSwapButtonTitle(SwapButtonTitle.PREVIEW);
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
      setSwapButtonTitle(SwapButtonTitle.PREVIEW);
      handleCheckBalance(swapState.to.amount || '0', assetId);
    },
    [assets, swapState, handleSwapModeChange, handleCheckBalance],
  );

  const handleChangeAssetAmount = useCallback(
    (mode: SwapMode, value: string) => {
      setSwapState((prevState) => {
        const stateMode = mode === 'sell' ? 'from' : 'to';
        const updatedAsset = prevState[stateMode];
        const otherKey = stateMode === 'from' ? 'to' : 'from';
        const otherAsset = prevState[otherKey];
        handleSwapModeChange(mode);
        if (mode === 'sell') {
          handleCheckBalance(value, updatedAsset.assetId);
        }
        return {
          ...prevState,
          status: 'idle',
          [stateMode]: {
            ...updatedAsset,
            amount: value,
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
      if (swapMode === 'buy') {
        handleCheckBalance(amount, swapState.from.assetId);
      }
      setSwapState((prevState) => ({
        ...prevState,
        from: {
          ...prevState.from,
          amount,
        },
      }));
    },
    [
      swapState.from.amount,
      handleCheckBalance,
      swapState.from.assetId,
      swapMode,
    ],
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
  }, [
    trade,
    swapMode,
    handleUpdateAmountIn,
    handleUpdateAmountOut,
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

  const isInsufficientBalance = useMemo(
    () => swapButtonTitle === SwapButtonTitle.INSUFFICIENT_BALANCE,
    [swapButtonTitle],
  );

  return (
    <Stack spacing={1}>
      <CoinBox
        mode="sell"
        coin={swapState.from}
        onChangeAsset={handleFromAssetSelect}
        assets={assets}
        onChangeAmount={(value) => handleChangeAssetAmount('sell', value)}
        isLoadingAmount={isLoading && swapMode === 'buy'}
      />

      <SwapDivider onSwap={handleSwapAssets} />

      <CoinBox
        mode="buy"
        coin={swapState.to}
        onChangeAsset={handleToAssetSelect}
        assets={assets}
        onChangeAmount={(value) => handleChangeAssetAmount('buy', value)}
        isLoadingAmount={isLoading && swapMode === 'sell'}
      />

      {trade.error && <SwapError error={trade.error} />}

      {!availableEthBalance && <GasAlert />}

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
          variant="primary"
          isDisabled={isEmptyAmounts || isEmptyAssets || isInsufficientBalance}
          isLoading={isLoadingPreview || isSendingTx || isLoading}
          onClick={handleSubmitSwap}
        >
          {swapButtonTitle}
        </Button>
      </Flex>
    </Stack>
  );
});

RootSwap.displayName = 'RootSwap';
