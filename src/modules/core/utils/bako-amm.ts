import {
  Account,
  AssetId,
  BN,
  ScriptTransactionRequest,
  TxParams,
} from 'fuels';
import { PoolId } from 'mira-dex-ts';
import {
  addressInput,
  assetInput,
  poolIdInput,
} from 'mira-dex-ts/dist/sdk/utils';
import { Swap } from 'sway/artifacts';

export const DEFAULT_AMM_CONTRACT_ID =
  '0x2e40f2b244b98ed6b8204b3de0156c6961f98525c8162f80162fcf53eebd90e7';
export const TESTNET_AMM_CONTRACT_ID =
  '0xd5a716d967a9137222219657d7877bd8c79c64e1edb5de9f2901c98ebe74da80';
const DEFAULT_BAKO_SWAP_CONTRACT_ID =
  '0x06ecda792477f3e9632621ca4a6fe6af7e81093bc843d43b562771285b7d8c37';

export default class BakoAMM {
  private readonly account: Account;
  private readonly bakoAmm: Swap;

  constructor(account: Account, contractIdOpt?: string) {
    const contractId = contractIdOpt ?? DEFAULT_BAKO_SWAP_CONTRACT_ID;
    this.account = account;
    this.bakoAmm = new Swap(contractId, account);
  }

  async swapExactInput(
    amountIn: BN,
    assetIn: AssetId,
    amountOutMin: BN,
    pools: PoolId[],
    deadline: BN,
    txParams?: TxParams,
  ): Promise<ScriptTransactionRequest> {
    const request = await this.bakoAmm.functions
      .swap_exact_input(
        amountIn,
        assetInput(assetIn),
        amountOutMin,
        pools.map(poolIdInput),
        addressInput(this.account.address),
        deadline,
      )
      .callParams({
        forward: {
          amount: amountIn,
          assetId: assetIn.bits,
        },
      })
      .txParams(txParams ?? {})
      .getTransactionRequest();

    const inputAssets = [
      {
        assetId: assetIn.bits,
        amount: amountIn,
      },
    ];

    request.addResources(await this.account.getResourcesToSpend(inputAssets));

    const req = await this.fundRequest(request);
    await this.account.provider.estimateTxDependencies(req);

    return req;
  }

  async swapExactOutput(
    amountOut: BN,
    assetOut: AssetId,
    amountInMax: BN,
    pools: PoolId[],
    deadline: BN,
    txParams?: TxParams,
  ): Promise<ScriptTransactionRequest> {
    let assetIn = assetOut;
    for (const pool of pools.reverse()) {
      if (pool[0].bits === assetIn.bits) {
        assetIn = pool[1];
      } else {
        assetIn = pool[0];
      }
    }
    const request = await this.bakoAmm.functions
      .swap_exact_output(
        amountOut,
        assetInput(assetOut),
        amountInMax,
        pools.map(poolIdInput),
        addressInput(this.account.address),
        deadline,
      )
      .callParams({
        forward: {
          amount: amountInMax,
          assetId: assetIn.bits,
        },
      })
      .txParams(txParams ?? {})
      .getTransactionRequest();

    const inputAssets = [
      {
        assetId: assetIn.bits,
        amount: amountInMax,
      },
    ];

    request.addResources(await this.account.getResourcesToSpend(inputAssets));

    const req = await this.fundRequest(request);
    await this.account.provider.estimateTxDependencies(req);

    return req;
  }

  async fundRequest(
    request: ScriptTransactionRequest,
  ): Promise<ScriptTransactionRequest> {
    const gasCost = await this.account.getTransactionCost(request);
    return await this.account.fund(request, gasCost);
  }
}
