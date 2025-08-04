import { Asset, FAKE_WITNESSES, ITransactionResume } from 'bakosafe';
import { Address, bn, calculateGasFee, ScriptTransactionRequest } from 'fuels';

import { api } from '@/config/api';
import { ITransaction } from '@/modules/core/hooks/bakosafe/utils/types';

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
  ITransactionHistory,
  ITransactionInfinityQueryData,
  ITransactionQueryUpdatePage,
  ITransactionReactQueryUpdate,
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
    const { vault, assets: assetsToSpend, assetsMap } = input;

    const predicateGasUsed = await vault.maxGasUsed();
    let transactionRequest = new ScriptTransactionRequest();
    const assets = [...(assetsToSpend || [])];

    const baseAssetId = await vault.provider.getBaseAssetId();
    const hasETHAsset = assets.some((a) => a.assetId === baseAssetId);

    if (!assets.length || !hasETHAsset) {
      const { coins } = await vault.getCoins(baseAssetId);

      const resources = vault.generateFakeResources(
        coins.map((c) => ({
          assetId: c.assetId,
          amount: c.amount,
        })),
      );

      assets.push({
        amount: bn(1).formatUnits(),
        assetId: baseAssetId,
        to: Address.fromRandom().toString(),
      });

      transactionRequest.addResources(resources);
    }

    const outputs = Asset.assetsGroupByTo(assets);
    const coins = Asset.assetsGroupById(assets);

    if (!coins[baseAssetId]) {
      coins[baseAssetId] = bn(0);
    }

    const transactionCoins = Object.entries(coins).map(([assetId, amount]) => {
      const assetUnits = assetsMap?.[assetId]?.units;
      const asset = assets.find((a) => a.assetId === assetId);

      if (assetUnits !== 9 && asset?.amount) {
        amount = bn.parseUnits(asset.amount, assetUnits);
      }

      return {
        assetId,
        amount,
      };
    });

    const _coins = await vault.getResourcesToSpend(transactionCoins);

    const fakeCoins = vault.generateFakeResources(
      _coins.map((c) => ({
        assetId: c.assetId,
        amount: c.amount,
      })),
    );

    Object.entries(outputs).forEach(([, value]) => {
      const assetId = value.assetId;
      const assetUnits = assetsMap?.[assetId]?.units;
      const asset = assets.find((a) => a.assetId === assetId);

      if (assetUnits !== 9 && asset?.amount) {
        value.amount = bn.parseUnits(asset.amount, assetUnits);
      }

      transactionRequest.addCoinOutput(vault.address, value.amount, assetId);
    });

    transactionRequest.addResources(fakeCoins);

    const fakeSignatures = Array.from({ length: 10 }, () => FAKE_WITNESSES);
    fakeSignatures.forEach((sig) => transactionRequest.addWitness(sig));

    transactionRequest = await transactionRequest.estimateAndFund(vault);

    let totalGasUsed = bn(0);
    transactionRequest.inputs.forEach((input) => {
      if ('predicate' in input && input.predicate) {
        input.witnessIndex = 0;
        input.predicateGasUsed = undefined;
        totalGasUsed = totalGasUsed.add(predicateGasUsed);
      }
    });

    const { gasPriceFactor } = await vault.provider.getGasConfig();
    const { maxFee, gasPrice } = await vault.provider.estimateTxGasAndFee({
      transactionRequest,
    });

    const predicateSuccessFeeDiff = calculateGasFee({
      gas: totalGasUsed,
      priceFactor: gasPriceFactor,
      gasPrice,
    });

    const maxFeeWithDiff = maxFee.add(predicateSuccessFeeDiff).mul(14).div(10);

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

  static updateTransactionHistoryReactQuery(
    oldData: ITransactionHistory,
    event: ITransactionReactQueryUpdate,
  ) {
    if (!oldData) return oldData;
    return event.history;
  }

  static updateTransactionReactQuery(
    oldData: ITransactionQueryUpdatePage,
    event: ITransactionReactQueryUpdate,
  ): ITransactionQueryUpdatePage {
    if (!oldData) return oldData;

    const { type, transaction } = event;

    if (type !== '[CREATED]') {
      return {
        ...oldData,
        data: oldData.data.map((tx: ITransaction) =>
          tx.id === transaction.id ? transaction : tx,
        ),
      };
    }

    return {
      ...oldData,
      data: [transaction, ...oldData.data],
    };
  }

  static updateInfiniteTransactionReactQuery(
    oldData: ITransactionInfinityQueryData,
    event: ITransactionReactQueryUpdate,
  ): ITransactionInfinityQueryData {
    if (!oldData) return oldData;

    const { type, transaction } = event;
    const { pageParams, pages } = oldData;

    if (type !== '[CREATED]') {
      return {
        pageParams,
        pages: pages.map((page: ITransactionQueryUpdatePage) =>
          page.data.some((item: ITransaction) => item.id === transaction.id)
            ? {
                ...page,
                data: page.data.map((item: ITransaction) =>
                  item.id === transaction.id ? transaction : item,
                ),
              }
            : page,
        ),
      };
    }

    return {
      pageParams,
      pages: pages.map((page: any, index: number) =>
        index === 0 ? { ...page, data: [transaction, ...page.data] } : page,
      ),
    };
  }
}
