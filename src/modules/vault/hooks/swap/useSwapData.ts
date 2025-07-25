import { useMutation } from '@tanstack/react-query';
import { Vault } from 'bakosafe';
import { Address, BN, bn, Provider, ScriptTransactionRequest } from 'fuels';
import { MiraAmm, PoolId } from 'mira-dex-ts';

import { BAKO_FEE_ADDRESS, BAKO_FEE_PERCENTAGE } from '@/config/swap';
import { useContactToast } from '@/modules/addressBook';

import { SwapMode, SwapState } from '../../components/swap/Root';
import { useProvider } from '../useProvider';

async function futureDeadline(provider: Provider) {
  const block = await provider.getBlock('latest');
  return block?.height.add(1000) ?? 1000000000;
}

const addBakoFee = (
  bakoFee: BN,
  request: ScriptTransactionRequest,
  asset: string,
) => {
  return request.addCoinOutput(new Address(BAKO_FEE_ADDRESS), bakoFee, asset);
};

async function constructSwapTransaction(
  mode: SwapMode,
  state: SwapState,
  amm: MiraAmm,
  slippage: number,
  provider: Provider,
  pools: PoolId[],
) {
  const { to, from } = state;
  const swapFee = bn(BAKO_FEE_PERCENTAGE);
  if (mode === 'sell') {
    const assetIn = from.assetId;

    const minAmountOut = bn
      .parseUnits(state.to.amount || '0', state.to.units)
      .mul(bn(100 - Math.floor(slippage * 100)))
      .div(bn(100));
    const bakoFee = minAmountOut.mul(swapFee).div(bn(100));
    const minAmountOutAfterFee = minAmountOut.sub(bakoFee);
    console.log(
      '####FEE: ',
      minAmountOut.toString(),
      bakoFee.toString(),
      minAmountOutAfterFee.toString(),
      pools,
    );
    const amountIn = bn.parseUnits(state.from.amount || '0', state.from.units);

    const request = await amm.swapExactInput(
      amountIn,
      { bits: assetIn },
      minAmountOut,
      pools,
      await futureDeadline(provider),
      {
        maxFee: bn(1000000),
      },
    );

    return { request, bakoFee };
  }
  const assetOut = to.assetId;
  const maxAmountIn = bn
    .parseUnits(state.from.amount || '0', state.from.units)
    .mul(bn(100 + Math.floor(slippage * 100)))
    .div(bn(100));
  const bakoFee = maxAmountIn.mul(swapFee).div(bn(100));
  const amountOut = bn.parseUnits(state.to.amount || '0', state.to.units);
  const minAmountInAfterFee = maxAmountIn.add(bakoFee);

  const request = await amm.swapExactOutput(
    amountOut,
    { bits: assetOut },
    minAmountInAfterFee,
    pools,
    await futureDeadline(provider),
    {
      maxFee: bn(1000000),
    },
  );

  return { request: addBakoFee(bakoFee, request, from.assetId), bakoFee };
}

export const useSwapData = ({
  amm,
  vault,
  pools,
}: {
  amm?: MiraAmm;
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
      if (!amm || !provider) {
        throw new Error('Mira AMM or provider is not available');
      }
      if (!vault) throw new Error('Vault is not available');

      const { request, bakoFee } = await constructSwapTransaction(
        mode,
        state,
        amm,
        slippage,
        provider!,
        pools,
      );

      const tx = await vault.getTransactionCost(request);

      return { tx, request, bakoFee };
    },
    onError: (e) => {
      console.error('Error fetching swap preview:', e);
      errorToast({
        title: 'Error fetching swap preview',
        description: 'Please try again later.',
      });
    },
  });

  return { swapData, getSwapPreview, ...rest };
};
