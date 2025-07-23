import { Button, Flex, Stack } from '@chakra-ui/react';
import { Vault } from 'bakosafe';
import { BN, bn } from 'fuels';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { BAKO_FEE_PERCENTAGE } from '@/config/swap';
import { Asset, FUEL_ASSET_ID, NativeAssetId, useToast } from '@/modules';
import { DEFAULT_SLIPPAGE, SwapButtonTitle } from '@/modules/core/utils/swap';

import {
  useGetAmountIn,
  useGetAmountOut,
  useSwap,
  useSwapData,
  useSwapPreview,
} from '../../hooks/swap';
import { useMira } from '../../hooks/swap/useMira';
import { State } from '../../hooks/swap/useSwapRouter';
import { CoinBox } from './CoinBox';
import { SwapCost } from './SwapCost';
import { SwapDivider } from './SwapDivider';

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
  const { success, error } = useToast();
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

  const { trade } = useSwapPreview(swapState, swapMode);

  const pools = useMemo(
    () => trade?.bestRoute?.pools.map((pool) => pool.poolId) || [],
    [trade],
  );

  const isLoading = trade.state === State.LOADING;

  console.log('Swap pools:', pools);
  console.log('Swap trade:', trade);

  const {
    swapData,
    getSwapPreview,
    isPending: isLoadingPreview,
  } = useSwapData({ amm, vault });

  const { sendTx, isPending: isSendingTx } = useSwap();

  const handleSubmitSwap = useCallback(async () => {
    if (swapState.status === 'idle') {
      await getSwapPreview({
        state: swapState,
        mode: swapMode,
        slippage: DEFAULT_SLIPPAGE,
      });
      setSwapState((prevState) => ({
        ...prevState,
        status: 'preview',
      }));
      setSwapButtonTitle(SwapButtonTitle.SWAP);
    }
    if (swapState.status === 'preview' && swapData?.request) {
      await sendTx({
        vault,
        tx: swapData.request,
      })
        .then(() => {
          success('Swap transaction sent successfully');
          setSwapState((prevState) => ({
            ...prevState,
            status: 'idle',
          }));
          setSwapButtonTitle(SwapButtonTitle.PREVIEW);
        })
        .catch((err) => {
          console.log('Swap transaction error:', err);
          error('Swap transaction failed, try again later');
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
    success,
    error,
  ]);

  const handleResetAmounts = useCallback(() => {
    setSwapMode('idle');
    setSwapState((prevState) => ({
      ...prevState,
      from: {
        ...prevState.from,
        amount: '0',
      },
      to: {
        ...prevState.to,
        amount: '0',
      },
    }));
  }, []);

  const handleSwapModeChange = useCallback(
    (mode: SwapMode) => {
      if (swapMode !== mode) {
        setSwapMode(mode);
      }
    },
    [swapMode],
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
            amount: prevState.from.amount || '0',
          },
        }));
      }
    },
    [assets, swapState, handleSwapModeChange],
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
            amount: prevState.to.amount || '0',
          },
        }));
      }
    },
    [assets, swapState, handleSwapModeChange],
  );

  const handleCheckBalance = useCallback(
    (amount: string) => {
      const asset = assets.find(
        (asset) => asset.assetId === swapState.from.assetId,
      );
      if (asset && asset.balance) {
        const balance = asset.balance.formatUnits(asset.units);
        const isBalanceSufficient = bn
          .parseUnits(amount, asset.units)
          .lte(bn.parseUnits(balance));

        if (isBalanceSufficient) {
          return setSwapButtonTitle(SwapButtonTitle.PREVIEW);
        }
      }
      if (swapButtonTitle !== SwapButtonTitle.INSUFFICIENT_BALANCE) {
        setSwapButtonTitle(SwapButtonTitle.INSUFFICIENT_BALANCE);
      }
    },
    [assets, swapState.from.assetId, setSwapButtonTitle, swapButtonTitle],
  );

  const handleChangeAssetAmount = useCallback(
    (mode: SwapMode, value: string) => {
      setSwapState((prevState) => {
        const stateMode = mode === 'sell' ? 'from' : 'to';
        const updatedAsset = prevState[stateMode];
        const otherKey = stateMode === 'from' ? 'to' : 'from';
        const otherAsset = prevState[stateMode === 'from' ? 'to' : 'from'];
        handleSwapModeChange(mode);
        if (mode === 'sell') {
          handleCheckBalance(value);
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
            amount: '0',
          },
        };
      });
    },
    [handleSwapModeChange, handleCheckBalance],
  );

  const handleSwapAssets = useCallback(() => {
    setSwapState((prevState) => ({
      ...prevState,
      from: prevState.to,
      to: prevState.from,
    }));
    if (swapState.from.amount && swapState.from.amount !== '0') {
      handleCheckBalance(swapState.from.amount);
    }
  }, [handleCheckBalance, swapState.from.amount]);

  const { amountOut, isLoading: isLoadingAmountOut } = useGetAmountOut({
    state: swapState,
    mode: swapMode,
    pools,
  });

  const { amountIn, isLoading: isLoadingAmountIn } = useGetAmountIn({
    state: swapState,
    mode: swapMode,
    pools,
  });

  const handleUpdateAmountOut = useCallback((amount: string, fee?: BN) => {
    setSwapState((prevState) => ({
      ...prevState,
      to: {
        ...prevState.to,
        amount,
      },
      fee,
    }));
  }, []);

  const handleUpdateAmountIn = useCallback((amount: string, fee?: BN) => {
    setSwapState((prevState) => ({
      ...prevState,
      from: {
        ...prevState.from,
        amount,
      },
      fee,
    }));
  }, []);

  console.log('####AMOUNT_OUT: ', amountOut);
  useEffect(() => {
    if (amountOut && !isLoadingAmountOut && swapMode === 'sell') {
      const _amountOut = amountOut?.[1]?.[1];
      const FEE_PERCENT = BAKO_FEE_PERCENTAGE;
      const fee = _amountOut.mul(FEE_PERCENT);
      console.log(fee.formatUnits(), _amountOut.formatUnits()); // this is 0.000000000 195.447936595 why ?

      const amountAfterFee = _amountOut.sub(fee);
      const amount = amountAfterFee.formatUnits(swapState.to.units);

      if (amount && swapState.to.amount !== amount) {
        handleUpdateAmountOut(amount, fee);
      }
    }
  }, [
    amountOut,
    isLoadingAmountOut,
    swapMode,
    handleUpdateAmountOut,
    swapState.to.units,
    swapState.to.amount,
  ]);

  useEffect(() => {
    if (amountIn && !isLoadingAmountIn && swapMode === 'buy') {
      const _amountIn = amountIn?.[1]?.[1];
      const FEE_PERCENT = BAKO_FEE_PERCENTAGE;
      const fee = _amountIn.mul(FEE_PERCENT);
      console.log(fee.formatUnits());
      const amountAfterFee = _amountIn.sub(fee);
      const amount = amountAfterFee.formatUnits(swapState.from.units);

      if (amount && swapState.from.amount !== amount) {
        handleUpdateAmountIn(amount, fee);
      }
    }
  }, [
    amountIn,
    isLoadingAmountIn,
    swapMode,
    handleUpdateAmountIn,
    swapState.from.units,
    swapState.from.amount,
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

  console.log(swapState);

  return (
    <Stack spacing={1}>
      <CoinBox
        mode="sell"
        coin={swapState.from}
        onChangeAsset={handleFromAssetSelect}
        assets={assets}
        onChangeAmount={(value) => handleChangeAssetAmount('sell', value)}
        isLoadingAmount={isLoadingAmountIn || (isLoading && swapMode === 'buy')}
      />

      <SwapDivider onSwap={handleSwapAssets} />

      <CoinBox
        mode="buy"
        coin={swapState.to}
        onChangeAsset={handleToAssetSelect}
        assets={assets}
        onChangeAmount={(value) => handleChangeAssetAmount('buy', value)}
        isLoadingAmount={
          isLoadingAmountOut || (isLoading && swapMode === 'sell')
        }
      />

      {swapButtonTitle === SwapButtonTitle.SWAP && (
        <SwapCost
          isLoadingCost={isLoadingPreview}
          pools={pools}
          txCost={swapData?.tx}
          swapState={swapState}
        />
      )}

      <Flex alignItems="center" gap={2} mt={4}>
        <Button variant="secondary" onClick={handleResetAmounts}>
          Cancel
        </Button>
        <Button
          w="full"
          variant="primary"
          isDisabled={isEmptyAmounts || isEmptyAssets || isInsufficientBalance}
          isLoading={isLoadingPreview || isSendingTx}
          onClick={handleSubmitSwap}
        >
          {swapButtonTitle}
        </Button>
      </Flex>
    </Stack>
  );
});

RootSwap.displayName = 'RootSwap';
