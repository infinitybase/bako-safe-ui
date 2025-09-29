import { Asset, ITransactionResume, Vault } from 'bakosafe';
import {
  Address,
  BN,
  bn,
  calculateGasFee,
  Provider,
  ScriptTransactionRequest,
} from 'fuels';
import memoize from 'lodash.memoize';

import { api } from '@/config/api';
import { ITransaction } from '@/modules/core/hooks/bakosafe/utils/types';

import {
  createTxCostHash,
  FAKE_SIGNATURES,
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

const getBaseAssetIdInternal = async (provider: Provider) => {
  return await provider.getBaseAssetId();
};

const getPredicateGasInternal = async (vault: Vault) => {
  return await vault.maxGasUsed();
};

const getBaseAssetId = memoize(
  getBaseAssetIdInternal,
  (provider: Provider) => provider.url,
);

const getPredicateGas = memoize(getPredicateGasInternal, (vault: Vault) =>
  vault.address.toString(),
);

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

  static resolveTransactionCosts = memoize(
    async (input: ResolveTransactionCostInput) => {
      const { vault, assets: assetsToSpend, assetsMap } = input;
      const predicateGasUsed = await getPredicateGas(vault);

      let transactionRequest = new ScriptTransactionRequest();
      const assets = [...(assetsToSpend || [])];

      const baseAssetId = await getBaseAssetId(vault.provider);
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

      const assetUnitsMap = new Map<string, number>();
      const assetAmountMap = new Map<string, string>();

      assets.forEach((asset) => {
        const units = assetsMap?.[asset.assetId]?.units;
        if (typeof units === 'number') assetUnitsMap.set(asset.assetId, units);
        if (asset.amount) {
          const currentAmount = assetAmountMap.get(asset.assetId) || '0';
          const newAmount = bn
            .parseUnits(currentAmount, units)
            .add(bn.parseUnits(asset.amount, units));
          assetAmountMap.set(asset.assetId, newAmount.formatUnits());
        }
      });

      const transactionCoins = assets.reduce(
        (acc, asset) => {
          const alreadyExist = acc.find((a) => a.assetId === asset.assetId);
          if (alreadyExist) {
            // prevent duplicated assetIds
            return acc;
          }
          const units = assetUnitsMap.get(asset.assetId);
          const amount = assetAmountMap.get(asset.assetId);
          if (!units || !amount) return acc;
          const assetUnits = units;
          const amountBN = bn.parseUnits(amount || '0', assetUnits);

          return [...acc, { assetId: asset.assetId, amount: amountBN }];
        },
        [] as { assetId: string; amount: BN }[],
      );

      const _coins = await vault.getResourcesToSpend(transactionCoins);

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

      // TODO: estimateAndFund is deprecated -> use assembleTx
      transactionRequest = await transactionRequest.estimateAndFund(vault);

      const totalGasUsed = transactionRequest.inputs.reduce((acc, input) => {
        if ('predicate' in input && input.predicate) {
          input.witnessIndex = 0;
          input.predicateGasUsed = undefined;
          return acc.add(predicateGasUsed);
        }
        return acc;
      }, bn(0));

      const { gasPriceFactor } = await vault.provider.getGasConfig();
      const { maxFee, gasPrice } = await vault.provider.estimateTxGasAndFee({
        transactionRequest,
      });

      const serializedTxCount = bn(
        transactionRequest.toTransactionBytes().length,
      );
      const totalGasWithBytes = totalGasUsed.add(serializedTxCount.mul(64));

      const predicateSuccessFeeDiff = calculateGasFee({
        gas: totalGasWithBytes,
        priceFactor: gasPriceFactor,
        gasPrice,
      });

      const maxFeeWithDiff = maxFee
        .add(predicateSuccessFeeDiff)
        .mul(20)
        .div(10);

      return {
        fee: maxFeeWithDiff,
      };
    },
    (input: ResolveTransactionCostInput) => createTxCostHash(input),
  );

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
