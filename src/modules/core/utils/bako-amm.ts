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
  contractIdInput,
  poolIdInput,
} from 'mira-dex-ts/dist/sdk/utils';
import { SwapExactInputScript, SwapExactOutputScript } from 'sway/artifacts';

import { BAKO_FEE_ADDRESS, BAKO_FEE_PERCENTAGE } from '@/config/swap';

export const DEFAULT_AMM_CONTRACT_ID =
  '0x2e40f2b244b98ed6b8204b3de0156c6961f98525c8162f80162fcf53eebd90e7';

export default class BakoAMM {
  private readonly account: Account;
  private readonly swapExactInputScriptLoader: SwapExactInputScript;
  private readonly swapExactOutputScriptLoader: SwapExactOutputScript;

  constructor(account: Account, contractIdOpt?: string) {
    const contractId = contractIdOpt ?? DEFAULT_AMM_CONTRACT_ID;
    const contractIdConfigurables = {
      AMM_CONTRACT_ID: contractIdInput(contractId),
      BAKO_FEE: BAKO_FEE_PERCENTAGE,
      BAKO_FEE_RECEIVER: {
        Address: { bits: BAKO_FEE_ADDRESS },
      },
    };
    this.account = account;
    this.swapExactInputScriptLoader = new SwapExactInputScript(
      account,
    ).setConfigurableConstants(contractIdConfigurables);
    this.swapExactOutputScriptLoader = new SwapExactOutputScript(
      account,
    ).setConfigurableConstants(contractIdConfigurables);
  }

  async swapExactInput(
    amountIn: BN,
    assetIn: AssetId,
    amountOutMin: BN,
    pools: PoolId[],
    deadline: BN,
    txParams?: TxParams,
  ): Promise<ScriptTransactionRequest> {
    const request = await this.swapExactInputScriptLoader.functions
      .main(
        amountIn,
        assetInput(assetIn),
        amountOutMin,
        pools.map(poolIdInput),
        addressInput(this.account.address),
        deadline,
      )
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
    const request = await this.swapExactOutputScriptLoader.functions
      .main(
        amountOut,
        assetInput(assetOut),
        amountInMax,
        pools.map(poolIdInput),
        addressInput(this.account.address),
        deadline,
      )
      .txParams(txParams ?? {})
      .getTransactionRequest();

    let assetIn = assetOut;
    for (const pool of pools.reverse()) {
      if (pool[0].bits === assetIn.bits) {
        assetIn = pool[1];
      } else {
        assetIn = pool[0];
      }
    }

    const inputAssets = [
      {
        assetId: assetIn.bits,
        amount: amountInMax,
      },
    ];
    console.log('inputAssets', inputAssets);

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
