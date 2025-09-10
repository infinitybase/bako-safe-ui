import { Asset, ITransactionResume } from 'bakosafe';
import { Address, bn, calculateGasFee, ScriptTransactionRequest } from 'fuels';

import { api } from '@/config/api';
import { ITransaction } from '@/modules/core/hooks/bakosafe/utils/types';

import {
  createTxCostHash,
  FAKE_SIGNATURES,
  transactionCostCache,
} from '../states/transactionCostCache';
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

// Cache estático para evitar re-chamadas desnecessárias
const baseAssetIdCache = new Map<string, string>();
const predicateGasCache = new Map<string, ReturnType<typeof bn>>();

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
    const hash = createTxCostHash(input);
    console.log({ hash });
    const cachedCosts = transactionCostCache.get(hash);
    console.log('return by cache', cachedCosts);
    if (cachedCosts) return cachedCosts;

    // Cache do predicateGasUsed para evitar chamadas repetidas
    const vaultAddress = vault.address.toString();
    let predicateGasUsed = predicateGasCache.get(vaultAddress);
    if (!predicateGasUsed) {
      predicateGasUsed = await vault.maxGasUsed();
      predicateGasCache.set(vaultAddress, predicateGasUsed);
    }

    let transactionRequest = new ScriptTransactionRequest();
    const assets = [...(assetsToSpend || [])];

    // Cache do baseAssetId para evitar chamadas repetidas ao provider
    const providerKey = vault.provider.url;
    let baseAssetId = baseAssetIdCache.get(providerKey);
    if (!baseAssetId) {
      baseAssetId = await vault.provider.getBaseAssetId();
      baseAssetIdCache.set(providerKey, baseAssetId);
    }

    const hasETHAsset = assets.find((a) => a.assetId === baseAssetId);

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

    // Otimização: Pre-calcular mapas para evitar múltiplos finds
    const assetUnitsMap = new Map<string, number>();
    const assetAmountMap = new Map<string, string>();

    // Pre-processar assets uma única vez
    assets.forEach((asset) => {
      const units = assetsMap?.[asset.assetId]?.units;
      if (units) assetUnitsMap.set(asset.assetId, units);
      if (asset.amount) assetAmountMap.set(asset.assetId, asset.amount);
    });

    const transactionCoins = Object.entries(coins).map(([assetId, amount]) => {
      const assetUnits = assetUnitsMap.get(assetId);
      const assetAmount = assetAmountMap.get(assetId);

      if (assetUnits !== 9 && assetAmount) {
        amount = bn.parseUnits(assetAmount, assetUnits);
      }

      return {
        assetId,
        amount,
      };
    });

    const _coins = await vault.getResourcesToSpend(transactionCoins);
    console.log({ transactionCoins, _coins });

    const fakeCoins = vault.generateFakeResources(
      _coins.map((c) => ({
        assetId: c.assetId,
        amount: c.amount,
      })),
    );

    Object.entries(outputs).forEach(([, value]) => {
      const assetId = value.assetId;
      const assetUnits = assetUnitsMap.get(assetId);
      const assetAmount = assetAmountMap.get(assetId);

      if (assetUnits !== 9 && assetAmount) {
        value.amount = bn.parseUnits(assetAmount, assetUnits);
      }

      transactionRequest.addCoinOutput(vault.address, value.amount, assetId);
    });

    transactionRequest.addResources(fakeCoins);

    FAKE_SIGNATURES.forEach((sig) => transactionRequest.addWitness(sig));

    // Otimização: estimateAndFund is deprecated | use assembleTx
    transactionRequest = await transactionRequest.estimateAndFund(vault);

    // Otimização: calcular gas total usando reduce em vez de forEach
    // let totalGasUsed = bn(0);
    const totalGasUsed = transactionRequest.inputs.reduce((acc, input) => {
      if ('predicate' in input && input.predicate) {
        input.witnessIndex = 0;
        input.predicateGasUsed = undefined;
        return acc.add(predicateGasUsed!);
      }
      return acc;
    }, bn(0));
    console.log(totalGasUsed.format(), predicateGasUsed?.format());

    const { gasPriceFactor } = await vault.provider.getGasConfig();
    const { maxFee, gasPrice } = await vault.provider.estimateTxGasAndFee({
      transactionRequest,
    });

    const serializedTxCount = bn(
      transactionRequest.toTransactionBytes().length,
    );
    totalGasUsed = totalGasUsed.add(serializedTxCount.mul(64));

    const predicateSuccessFeeDiff = calculateGasFee({
      gas: totalGasUsed,
      priceFactor: gasPriceFactor,
      gasPrice,
    });

    const maxFeeWithDiff = maxFee.add(predicateSuccessFeeDiff).mul(20).div(10);

    transactionCostCache.set(hash, { fee: maxFeeWithDiff });

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
