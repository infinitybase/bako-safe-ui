import { useMutation } from '@tanstack/react-query';
import { Vault } from 'bakosafe';
import { bn, Provider } from 'fuels';
import { MiraAmm, PoolId } from 'mira-dex-ts';

import { BAKO_FEE_PERCENTAGE } from '@/config/swap';
import { useContactToast } from '@/modules/addressBook';
import BakoAMM from '@/modules/core/utils/bako-amm';

import { SwapMode, SwapState } from '../../components/swap/Root';
import { useProvider } from '../useProvider';

async function futureDeadline(provider: Provider) {
  const block = await provider.getBlock('latest');
  return block?.height.add(1000) ?? bn(1000000000);
}

async function constructSwapTransaction(
  mode: SwapMode,
  state: SwapState,
  amm: BakoAMM,
  slippage: number,
  provider: Provider,
  pools: PoolId[],
) {
  const { to, from } = state;
  const swapFee = bn(BAKO_FEE_PERCENTAGE);
  const amountIn = bn.parseUnits(from.amount || '0', from.units);
  const amountOut = bn.parseUnits(to.amount || '0', to.units);
  if (mode === 'sell') {
    const assetIn = from.assetId;
    const assetOut = to.assetId;

    if (!to.amount) {
      throw new Error('Amount out is required');
    }

    const minAmountOut = amountOut
      .mul(bn(10_000).sub(bn(slippage)))
      .div(bn(10_000));
    const bakoFee = minAmountOut.mul(swapFee).div(bn(100));

    const request = await amm.swapExactInput(
      amountIn,
      { bits: assetIn },
      { bits: assetOut },
      minAmountOut,
      pools,
      await futureDeadline(provider),
      {
        maxFee: bn(100000),
        variableOutputs: 2,
      },
    );

    return { request, bakoFee };
  }
  // mode === 'buy'
  const assetOut = to.assetId;
  const amountInMax = amountIn;
  const bakoFee = amountInMax.mul(swapFee).div(bn(100));

  const request = await amm.swapExactOutput(
    amountOut,
    { bits: assetOut },
    { bits: from.assetId },
    amountInMax.add(bakoFee),
    pools,
    await futureDeadline(provider),
    {
      maxFee: bn(100000),
      variableOutputs: 2,
    },
  );

  return { request, bakoFee };
}

export const useSwapData = ({
  amm,
  vault,
  pools,
  bakoAmm,
}: {
  amm?: MiraAmm;
  bakoAmm?: BakoAMM;
  vault?: Vault;
  pools: PoolId[];
}) => {
  const provider = useProvider();
  const { errorToast } = useContactToast();

  const {
    data: swapData,
    mutateAsync: getSwapPreview,
    ...rest
  } = useMutation({
    mutationKey: ['swap-data', provider],
    mutationFn: async ({
      mode,
      state,
      slippage,
    }: {
      state: SwapState;
      mode: SwapMode;
      slippage: number;
    }) => {
      if (!amm || !provider || !bakoAmm) {
        throw new Error('Mira AMM or provider is not available');
      }
      if (!vault) throw new Error('Vault is not available');

      const { request, bakoFee } = await constructSwapTransaction(
        mode,
        state,
        bakoAmm,
        slippage,
        provider!,
        pools,
      );

      const tx = await vault.getTransactionCost(request);

      return { tx, request, bakoFee };
    },
    onError: (e) => {
      const amountOutputError = e.message.includes(
        'Insufficient output amount',
      );
      errorToast({
        title: 'Error fetching swap preview',
        description: amountOutputError
          ? 'Insufficient output amount.'
          : 'Please try again later.',
      });
    },
  });

  return { swapData, getSwapPreview, ...rest };
};
