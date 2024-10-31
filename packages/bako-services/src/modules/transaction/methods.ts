import { Asset, FAKE_WITNESSES, ITransactionResume } from "bakosafe";
import { bn, calculateGasFee, ScriptTransactionRequest } from "fuels";

import {
  GetTransactionHistoryResponse,
  GetTransactionParams,
  GetTransactionParamsForPaginationQuery,
  GetTransactionPendingResponse,
  GetTransactionResponse,
  GetTransactionsPaginationResponse,
  GetTransactionsWithIncomingsPaginationResponse,
  GetTransactionsWithIncomingsParams,
  GetUserTransactionsParams,
  GetUserTransactionsResponse,
  GetVaultTransactionsParams,
  GetVaultTransactionsResponse,
  ITransactionStatusFilter,
  ResolveTransactionCostInput,
  SignerTransactionPayload,
  SignerTransactionResponse,
} from "./types";
import { AxiosInstance } from "axios";
import { bindMethods } from "@/utils/bindMethods";

export class TransactionService {
  api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;

    bindMethods(this);
  }

  async getById(id: string) {
    const { data } = await this.api.get<GetTransactionResponse>(
      `/transaction/${id}`,
    );
    return data;
  }
  async getByHash(hash: string, status?: ITransactionStatusFilter) {
    const { data } = await this.api.get<GetTransactionResponse>(
      `/transaction/by-hash/0x${hash}`,
      {
        params: {
          status,
        },
      },
    );
    return data;
  }

  async signer(payload: SignerTransactionPayload) {
    const { hash, ...body } = payload;
    const { data } = await this.api.put<SignerTransactionResponse>(
      `/transaction/sign/${hash}`,
      {
        signature: body.signer,
        approve: !!body.confirm,
      },
    );
    return data;
  }

  async getTransactionsPagination(
    params: GetTransactionParamsForPaginationQuery,
  ) {
    const { data } = await this.api.get<GetTransactionsPaginationResponse>(
      `/transaction`,
      {
        params: { ...params },
      },
    );

    return data;
  }

  async getUserTransactions(params: GetUserTransactionsParams) {
    const { data } = await this.api.get<GetUserTransactionsResponse>(
      `/transaction`,
      {
        params: { ...params },
      },
    );
    return data;
  }

  async getTransactionsWithIncomingsPagination(
    params: GetTransactionsWithIncomingsParams,
  ) {
    const { data } =
      await this.api.get<GetTransactionsWithIncomingsPaginationResponse>(
        `/transaction/with-incomings`,
        {
          params: { ...params },
        },
      );
    return data;
  }

  async send(BakoSafeTransactionId: string) {
    const { data } = await this.api.post(
      `/transaction/send/${BakoSafeTransactionId}`,
    );

    return data;
  }

  async getVaultTransactions(params: GetVaultTransactionsParams) {
    const { data } = await this.api.get<GetVaultTransactionsResponse>(
      `/transaction`,
      {
        params: { ...params },
      },
    );
    return data;
  }

  async getTransactionsSignaturePending(predicateId?: string[]) {
    const { data } = await this.api.get<GetTransactionPendingResponse>(
      `/transaction/pending`,
      {
        params: { predicateId },
      },
    );
    return data;
  }

  async resolveTransactionCosts(input: ResolveTransactionCostInput) {
    const { vault, assets } = input;

    const predicateGasUsed = await vault.maxGasUsed();

    let transactionRequest = new ScriptTransactionRequest();

    if (assets.length) {
      const outputs = Asset.assetsGroupByTo(assets);
      const coins = Asset.assetsGroupById(assets);
      const baseAssetId = vault.provider.getBaseAssetId();
      const containETH = !!coins[baseAssetId];

      if (containETH) {
        const value = bn(0).add(coins[baseAssetId]);
        coins[baseAssetId] = value;
      } else {
        coins[baseAssetId] = bn(0);
      }
      const transactionCoins = Object.entries(coins).map(([key, value]) => {
        return {
          amount: value,
          assetId: key,
        };
      });
      const _coins = await vault.getResourcesToSpend(transactionCoins);

      // Add outputs
      Object.entries(outputs).map(([, value]) => {
        transactionRequest.addCoinOutput(
          vault.address,
          value.amount,
          value.assetId,
        );
      });

      // Add resources
      transactionRequest.addResources(_coins);
    } else {
      const resources = vault.generateFakeResources([
        { amount: bn(0), assetId: vault.provider.getBaseAssetId() },
      ]);
      transactionRequest.addResources(resources);
    }

    // Add witnesses
    const fakeSignatures = Array.from({ length: 10 }, () => FAKE_WITNESSES);
    fakeSignatures.forEach((signature) =>
      transactionRequest.addWitness(signature),
    );

    const transactionCost = await vault.getTransactionCost(transactionRequest);
    transactionRequest = await vault.fund(transactionRequest, transactionCost);

    // Calculate the total gas usage for the transaction
    let totalGasUsed = bn(0);
    transactionRequest.inputs.forEach((input) => {
      if ("predicate" in input && input.predicate) {
        input.witnessIndex = 0;
        input.predicateGasUsed = undefined;
        totalGasUsed = totalGasUsed.add(predicateGasUsed);
      }
    });

    // Estimate the max fee for the transaction and calculate fee difference
    const { gasPriceFactor } = vault.provider.getGasConfig();
    const { maxFee, gasPrice } = await vault.provider.estimateTxGasAndFee({
      transactionRequest,
    });

    const predicateSuccessFeeDiff = calculateGasFee({
      gas: totalGasUsed,
      priceFactor: gasPriceFactor,
      gasPrice,
    });

    const maxFeeWithDiff = maxFee.add(predicateSuccessFeeDiff).mul(1.2);

    return {
      fee: maxFeeWithDiff,
    };
  }

  async getTransactionsHistory(id: string, predicateId: string) {
    const { data } = await this.api.get<GetTransactionHistoryResponse>(
      `/transaction/history/${id}/${predicateId}`,
    );
    return data;
  }

  async verifyOnChain(id: string) {
    const { data } = await this.api.get<ITransactionResume>(
      `/transaction/verify/${id}`,
    );
    return data;
  }
}
