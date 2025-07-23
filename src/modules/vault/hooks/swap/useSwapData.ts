import { useMutation } from '@tanstack/react-query';
import { Vault } from 'bakosafe';
import { bn, Provider } from 'fuels';
import { buildPoolId, MiraAmm } from 'mira-dex-ts';

import { SwapMode, SwapState } from '../../components/swap/Root';
import { useProvider } from '../useProvider';

async function futureDeadline(provider: Provider) {
  const block = await provider.getBlock('latest');
  return block?.height.add(1000) ?? 1000000000;
}

async function constructSwapTransaction(
  mode: SwapMode,
  state: SwapState,
  amm: MiraAmm,
  slippage: number,
  provider: Provider,
) {
  const { to, from } = state;
  if (mode === 'sell') {
    const poolId = buildPoolId(from.assetId, to.assetId, false);
    const assetIn = from.assetId;

    const minAmountOut = bn
      .parseUnits(state.to.amount || '0', state.to.units)
      .mul(bn(100 - Math.floor(slippage & 100)))
      .div(bn(100));
    const amountIn = bn.parseUnits(state.from.amount || '0', state.from.units);

    const request = await amm.swapExactInput(
      amountIn,
      { bits: assetIn },
      minAmountOut,
      [poolId],
      await futureDeadline(provider),
    );
    return request;
  }
  const poolId = buildPoolId(to.assetId, from.assetId, false);
  const assetOut = to.assetId;
  const maxAmountIn = bn
    .parseUnits(state.from.amount || '0', state.from.units)
    .mul(bn(100 + Math.floor(slippage & 100)))
    .div(bn(100));
  const amountOut = bn.parseUnits(state.to.amount || '0', state.to.units);

  const request = await amm.swapExactOutput(
    amountOut,
    { bits: assetOut },
    maxAmountIn,
    [poolId],
    await futureDeadline(provider),
  );

  return request;
}

export const useSwapData = ({
  amm,
  vault,
}: {
  amm?: MiraAmm;
  vault?: Vault;
}) => {
  const provider = useProvider();

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
      if (!amm || !provider) {
        throw new Error('Mira AMM or provider is not available');
      }
      if (!vault) throw new Error('Vault is not available');

      const request = await constructSwapTransaction(
        mode,
        state,
        amm,
        slippage,
        provider!,
      );

      const tx = await vault.getTransactionCost(request);

      return { tx, request };
    },
  });

  return { swapData, getSwapPreview, ...rest };
};
