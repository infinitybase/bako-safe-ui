import { Box, Button, VStack } from 'bako-ui';
import { Vault } from 'bakosafe';
import { motion } from 'framer-motion';
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
import { getYPositionForSwapStep } from '../../utils';
import { CoinBox } from './CoinBox';
import { SwapReview } from './SwapReview';

export enum SwapSteps {
  SELECT_SELL = 0,
  SELECT_BUY = 1,
  RESUME = 2,
}

export type SwapState = {
  from: Asset;
  to: Asset;
  fee?: BN;
  status: 'idle' | 'preview' | 'error';
  step: SwapSteps;
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

const MotionBox = motion(Box);

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
      SwapButtonTitle.SWAP,
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
      step: SwapSteps.SELECT_SELL,
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

    const handleResetSwap = useCallback(() => {
      setSwapMode('idle');
      setSwapState((prevState) => ({
        from: {
          ...prevState.from,
          amount: '',
        },
        to: {
          ...prevState.to,
          amount: '',
        },
        fee: undefined,
        status: 'idle',
        step: SwapSteps.SELECT_SELL,
      }));
      setSwapButtonTitle(SwapButtonTitle.SWAP);
    }, []);

    const handlePreviewSwap = useCallback(async () => {
      if (
        !swapState.from.amount ||
        !swapState.to.amount ||
        swapMode === 'idle'
      ) {
        errorToast({
          title: 'Invalid Amount',
          description: 'Please enter valid amounts to preview the swap.',
        });
        return;
      }
      if (SwapButtonTitle.INSUFFICIENT_BALANCE === swapButtonTitle) {
        errorToast({
          title: 'Insufficient Balance',
          description: 'Insufficient balance to perform the swap.',
        });
        return;
      }
      setSwapState((prevState) => ({ ...prevState, step: SwapSteps.RESUME }));
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
    }, [swapState, swapMode, swapButtonTitle, getSwapPreview, errorToast]);

    const handleSubmitSwap = useCallback(async () => {
      if (swapState.status !== 'idle' && swapData?.request) {
        await sendTx({
          vault,
          tx: swapData.request,
          assetIn: swapState.from.slug,
          assetOut: swapState.to.slug,
        })
          .then(() => {
            successToast({ description: 'Swap transaction sent successfully' });
            handleResetSwap();
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
      swapState,
      swapData,
      sendTx,
      vault,
      successToast,
      errorToast,
      handleResetSwap,
    ]);

    const handleChangeSwapButtonTitle = useCallback(
      (title: SwapButtonTitle) => {
        setSwapButtonTitle((prevTitle) =>
          prevTitle !== title ? title : prevTitle,
        );
      },
      [],
    );

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
            return setSwapButtonTitle(SwapButtonTitle.SWAP);
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
          setSwapState((prevState) => ({
            ...prevState,
            to: isSameAsset ? prevState.from : prevState.to,
            from: {
              ...selectedAsset,
              amount: prevState.from.amount || '',
            },
            status: 'idle',
          }));
          handleChangeSwapButtonTitle(SwapButtonTitle.SWAP);
        }
        handleCheckBalance(swapState.from.amount || '0', assetId);
      },
      [assets, swapState, handleCheckBalance, handleChangeSwapButtonTitle],
    );

    const handleToAssetSelect = useCallback(
      (assetId: string) => {
        const selectedAsset = assets.find((asset) => asset.assetId === assetId);
        const isSameAsset = selectedAsset?.assetId === swapState.from.assetId;
        if (selectedAsset) {
          setSwapState((prevState) => ({
            ...prevState,
            from: isSameAsset ? prevState.to : prevState.from,
            to: {
              ...selectedAsset,
              amount: prevState.to.amount || '',
            },
            status: 'idle',
          }));
          handleChangeSwapButtonTitle(SwapButtonTitle.SWAP);
        }
      },
      [assets, swapState, handleChangeSwapButtonTitle],
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

          if (amountTo === '') return;
          setSwapState((prevState) => ({
            ...prevState,
            to: {
              ...prevState.to,
              amount: '',
            },
          }));
          return;
        }

        const amountFrom = swapState.from.amount;

        if (amountFrom === '') return;
        setSwapState((prevState) => ({
          ...prevState,
          from: {
            ...prevState.from,
            amount: '',
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
        setSwapButtonTitle(SwapButtonTitle.SWAP);
      }
    }, [isPendingSigner, swapButtonTitle, swapMode]);

    const handleChangeSwapStep = useCallback(
      (step: SwapSteps) => {
        if (step === swapState.step) return;
        setSwapState((prevState) => ({
          ...prevState,
          step,
        }));
      },
      [swapState.step],
    );

    const getOpacityForStep = useCallback(
      (step: SwapSteps) => {
        const distance = Math.abs(swapState.step - step);
        if (distance === 0) return 1; // Current step
        if (distance === 1) return 0.5; // 1 step away
        return 0.3; // 2+ steps away
      },
      [swapState.step],
    );

    const commonTransition = useMemo(
      () => ({
        duration: 0.6,
        ease: [0.32, 0.72, 0, 1],
      }),
      [],
    );

    const handleClickStep = useCallback(
      (step: SwapSteps) => {
        handleChangeSwapStep(step);
      },
      [handleChangeSwapStep],
    );

    return (
      <VStack
        w="full"
        h="600px"
        justifyContent="center"
        align="center"
        overflow="hidden"
        position="relative"
        pt="0"
      >
        <VStack
          w={{ sm: '456px', base: 'full' }}
          h="full"
          position="relative"
          justifyContent="center"
        >
          {/* SELECT_SELL STEP 0 */}
          <MotionBox
            onClick={() => handleClickStep(SwapSteps.SELECT_SELL)}
            position="absolute"
            w="full"
            animate={{
              opacity: getOpacityForStep(SwapSteps.SELECT_SELL),
              y: getYPositionForSwapStep(SwapSteps.SELECT_SELL, swapState.step),
            }}
            transition={commonTransition}
            style={{
              zIndex: swapState.step === SwapSteps.SELECT_SELL ? 5 : 1,
            }}
          >
            <CoinBox
              mode="sell"
              coin={swapState.from}
              onChangeAsset={handleFromAssetSelect}
              assets={assets}
              onChangeAmount={(value) => handleChangeAssetAmount('sell', value)}
              isLoadingAmount={isLoading && swapMode === 'buy'}
              isLoadingAssets={isLoadingAssets}
              isLoadingPreview={isLoadingPreview}
              isCurrentStep={swapState.step === SwapSteps.SELECT_SELL}
              error={trade.error}
              onContinue={() => handleChangeSwapStep(SwapSteps.SELECT_BUY)}
            />
          </MotionBox>

          {/* SELECT_BUY STEP 1 */}
          <MotionBox
            onClick={() => handleClickStep(SwapSteps.SELECT_BUY)}
            position="absolute"
            w="full"
            animate={{
              opacity: getOpacityForStep(SwapSteps.SELECT_BUY),
              y: getYPositionForSwapStep(SwapSteps.SELECT_BUY, swapState.step),
            }}
            transition={commonTransition}
            style={{
              zIndex: swapState.step === SwapSteps.SELECT_BUY ? 5 : 1,
            }}
          >
            <CoinBox
              mode="buy"
              coin={swapState.to}
              onChangeAsset={handleToAssetSelect}
              assets={assets}
              onChangeAmount={(value) => handleChangeAssetAmount('buy', value)}
              isLoadingAmount={isLoading}
              isLoadingAssets={isLoadingAssets}
              isLoadingPreview={isLoadingPreview}
              isCurrentStep={swapState.step === SwapSteps.SELECT_BUY}
              error={trade.error}
              onContinue={handlePreviewSwap}
            />
          </MotionBox>

          {/* RESUME STEP 2 */}
          <MotionBox
            onClick={() => {
              if (!swapData) {
                return;
              }
              handleClickStep(SwapSteps.RESUME);
            }}
            position="absolute"
            w="full"
            animate={{
              opacity: getOpacityForStep(SwapSteps.RESUME),
              y: getYPositionForSwapStep(SwapSteps.RESUME, swapState.step),
            }}
            transition={commonTransition}
            style={{
              zIndex: swapState.step === SwapSteps.RESUME ? 5 : 1,
            }}
          >
            <SwapReview
              isLoadingCost={isLoadingPreview || isLoading}
              pools={pools}
              txCost={swapData?.tx}
              swapState={swapState}
              mode={swapMode}
              isCurrentStep={swapState.step === SwapSteps.RESUME}
              error={trade.error}
            >
              <Button
                disabled={
                  isEmptyAmounts ||
                  isEmptyAssets ||
                  isInsufficientBalance ||
                  isPendingTransaction ||
                  isInsufficientETHBalance ||
                  isNoRoute ||
                  !!trade.error
                }
                loading={isLoadingPreview || isSendingTx || isLoading}
                onClick={handleSubmitSwap}
              >
                {swapButtonTitle}
              </Button>
            </SwapReview>
          </MotionBox>
        </VStack>
      </VStack>
    );
  },
);

RootSwap.displayName = 'RootSwap';
