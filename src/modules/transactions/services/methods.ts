import { Asset, FAKE_WITNESSES, ITransactionResume } from 'bakosafe';
import { bn, calculateGasFee, ScriptTransactionRequest } from 'fuels';

import { api } from '@/config/api';

import {
  CancelTransactionResponse,
  CloseTransactionPayload,
  CreateTransactionPayload,
  CreateTransactionResponse,
  GetTransactionHistoryResponse,
  GetTransactionParams,
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
} from './types';

export class TransactionService {
  static async create(payload: CreateTransactionPayload) {
    const { data } = await api.post<CreateTransactionResponse>(
      '/transaction',
      payload,
    );
    return data;
  }

  static async getById(id: string) {
    const { data } = await api.get<GetTransactionResponse>(
      `/transaction/${id}`,
    );
    return data;
  }
  static async getByHash(hash: string, status?: ITransactionStatusFilter) {
    const { data } = await api.get<GetTransactionResponse>(
      `/transaction/by-hash/0x${hash}`,
      {
        params: {
          status,
        },
      },
    );
    return data;
  }

  static async signer(payload: SignerTransactionPayload) {
    const { hash, ...body } = payload;
    const { data } = await api.put<SignerTransactionResponse>(
      `/transaction/sign/${hash}`,
      {
        signature: body.signer,
        approve: !!body.confirm,
      },
    );
    return data;
  }

  static async cancel(hash: string) {
    const { data } = await api.put<CancelTransactionResponse>(
      `/transaction/cancel/${hash}`,
    );
    return data;
  }

  static async close(id: string, payload: CloseTransactionPayload) {
    const { data } = await api.put<GetTransactionResponse>(
      `/transaction/close/${id}`,
      payload,
    );
    return data;
  }

  static async getTransactionsPagination(params: GetTransactionParams) {
    const { data } = await api.get<GetTransactionsPaginationResponse>(
      `/transaction`,
      {
        params: { ...params },
      },
    );

    return data;
  }

  static async getUserTransactions(params: GetUserTransactionsParams) {
    const { data } = await api.get<GetUserTransactionsResponse>(
      `/transaction`,
      {
        params: { ...params },
      },
    );
    return data;
  }

  static async getTransactionsWithIncomingsPagination(
    params: GetTransactionsWithIncomingsParams,
  ) {
    const { data } =
      await api.get<GetTransactionsWithIncomingsPaginationResponse>(
        `/transaction/with-incomings`,
        {
          params: { ...params },
        },
      );
    return data;
  }

  static async send(BakoSafeTransactionId: string) {
    const { data } = await api.post(
      `/transaction/send/${BakoSafeTransactionId}`,
    );

    return data;
  }

  static async getVaultTransactions(params: GetVaultTransactionsParams) {
    const { data } = await api.get<GetVaultTransactionsResponse>(
      `/transaction`,
      {
        params: { ...params },
      },
    );
    return data;
  }

  static async getTransactionsSignaturePending(predicateId?: string[]) {
    const { data } = await api.get<GetTransactionPendingResponse>(
      `/transaction/pending`,
      {
        params: { predicateId },
      },
    );
    return data;
  }

  static async resolveTransactionCosts(input: ResolveTransactionCostInput) {
    const { vault, assets } = input;

    const predicateGasUsed = await vault.maxGasUsed();

    let transactionRequest = new ScriptTransactionRequest();

    if (assets.length) {
      const outputs = Asset.assetsGroupByTo(assets);
      const coins = Asset.assetsGroupById(assets);
      const baseAssetId = await vault.provider.getBaseAssetId();
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
        { amount: bn(0), assetId: await vault.provider.getBaseAssetId() },
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
      if ('predicate' in input && input.predicate) {
        input.witnessIndex = 0;
        input.predicateGasUsed = undefined;
        totalGasUsed = totalGasUsed.add(predicateGasUsed);
      }
    });

    // Estimate the max fee for the transaction and calculate fee difference
    const { gasPriceFactor } = await vault.provider.getGasConfig();
    const { maxFee, gasPrice } = await vault.provider.estimateTxGasAndFee({
      transactionRequest,
    });

    const predicateSuccessFeeDiff = calculateGasFee({
      gas: totalGasUsed,
      priceFactor: gasPriceFactor,
      gasPrice,
    });

    const maxFeeWithDiff = maxFee.add(predicateSuccessFeeDiff).mul(12).div(10);

    return {
      fee: maxFeeWithDiff,
    };
  }

  static async getTransactionsHistory(id: string, predicateId: string) {
    const { data } = await api.get<GetTransactionHistoryResponse>(
      `/transaction/history/${id}/${predicateId}`,
    );
    return data;
  }

  static async verifyOnChain(id: string) {
    const { data } = await api.get<ITransactionResume>(
      `/transaction/verify/${id}`,
    );
    return data;
  }
}
