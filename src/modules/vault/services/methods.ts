import { BN, CoinQuantity } from 'fuels';

import { api } from '@/config';
import { Asset, NFT } from '@/modules/core';
import { IPredicate } from '@/modules/core/hooks/bakosafe/utils/types';
import {
  ICreateSwapBridgePayload,
  ICreateSwapBridgeResponse,
  IGetDestinationPayload,
  IGetDestinationsResponse,
  IGetLimitsResponse,
  IGetQuotesResponse,
  IUpdateSwapBridgeTxPayload,
  Predicate,
  Workspace,
} from '@/modules/core/models';
import {
  ICreateWidgetPayload,
  ICreateWidgetResponse,
  ICryptoCurrency,
  IFiatCurrency,
  IPaymentMethod,
  IPurchaseLimitsParams,
  IPurchaseLimitsResponse,
  IQuotePayload,
  IQuoteResponse,
  IServiceProviderResponse,
} from '@/modules/core/models/meld';
import { IPagination, PaginationParams } from '@/modules/core/utils/pagination';
import {
  GetTransactionResponse,
  SortOption,
} from '@/modules/transactions/services';

export interface GetAllPredicatesPayload extends PaginationParams {
  q?: string;
  address?: string;
  signer?: string;
  provider?: string;
  owner?: string;
  orderBy?: string;
  sort?: SortOption;
  orderByRoot?: boolean;
  hidden?: boolean;
}

export interface HasReservedCoins {
  currentBalanceUSD: string;
  reservedCoins: CoinQuantity[];
  currentBalance: Required<Asset>[];
  nfts: NFT[];
}

export type PredicateWorkspace = Omit<Workspace, 'permissions'>;
export type PredicateAndWorkspace = Predicate & {
  workspace: PredicateWorkspace;
  isHidden?: boolean;
};
export type PredicateResponseWithWorkspace = IPredicate & {
  workspace: Workspace;
};
export type GetHasReservedCoins = HasReservedCoins;
export type CreatePredicateResponse = Predicate;
export type GetAllPredicateResponse = PredicateAndWorkspace[];
export type GetAllPredicatePaginationResponse =
  IPagination<PredicateAndWorkspace>;
export type CreatePredicatePayload = Omit<
  Predicate,
  'id' | 'transactions' | 'completeAddress' | 'owner'
>;

export class VaultService {
  static async create(payload: CreatePredicatePayload) {
    const { data } = await api.post<CreatePredicateResponse>(
      '/predicate',
      payload,
    );
    return data;
  }

  static async getAllWithPagination(params: GetAllPredicatesPayload) {
    const { data } = await api.get<GetAllPredicatePaginationResponse>(
      '/predicate',
      {
        params,
      },
    );

    return data;
  }

  static async toggleVisibility(address: string) {
    const { data } = await api.put(`/predicate/${address}/visibility`);
    return data;
  }

  static async getById(id: string) {
    const { data } = await api.get<PredicateResponseWithWorkspace>(
      `/predicate/${id}`,
    );
    return data;
  }

  static async getByAddress(address: string) {
    const { data } = await api.get<PredicateResponseWithWorkspace>(
      `/predicate/by-address/${address}`,
    );
    return data;
  }

  static async getByName(name: string) {
    const { data } = await api.get<boolean>(`/predicate/by-name/${name}`);
    return data;
  }

  static async checkByAddress(address: string) {
    const { data } = await api.get<boolean>(
      `/predicate/check/by-address/${address}`,
    );
    return data;
  }

  static async findPredicates(address: string) {
    const { data } = await api.get<GetAllPredicateResponse>(`/predicate`, {
      data: {
        signer: address,
      },
    });
    return data;
  }

  static async hasReservedCoins(
    predicateId: string,
  ): Promise<HasReservedCoins> {
    const { data } = await api.get<HasReservedCoins>(
      `/predicate/reserved-coins/${predicateId}`,
    );
    return {
      ...data,
      reservedCoins: data.reservedCoins.map((reservedCoin) => ({
        ...reservedCoin,
        amount: new BN(reservedCoin.amount),
      })),
    };
  }

  static async getFiatCurrencies(): Promise<IFiatCurrency[]> {
    const { data } = await api.get<IFiatCurrency[]>(
      `/ramp-transactions/meld/fiat-currencies`,
    );
    return data;
  }

  static async getCryptoCurrencies(): Promise<ICryptoCurrency[]> {
    const { data } = await api.get<ICryptoCurrency[]>(
      `/ramp-transactions/meld/crypto-currencies`,
    );
    return data;
  }

  static async getPaymentMethods(): Promise<IPaymentMethod[]> {
    const { data } = await api.get<IPaymentMethod[]>(
      `/ramp-transactions/meld/payment-methods`,
    );
    return data;
  }

  static async getServiceProviders(): Promise<IServiceProviderResponse[]> {
    const { data } = await api.get<IServiceProviderResponse[]>(
      `/ramp-transactions/meld/providers`,
    );
    return data;
  }

  static async getOnRampPurchaseLimits(
    params?: IPurchaseLimitsParams,
  ): Promise<IPurchaseLimitsResponse[]> {
    const { data } = await api.get<IPurchaseLimitsResponse[]>(
      `/ramp-transactions/meld/buy-purchase-limits`,
      { params },
    );
    return data;
  }

  static async getOffRampPurchaseLimits(
    params?: IPurchaseLimitsParams,
  ): Promise<IPurchaseLimitsResponse[]> {
    const { data } = await api.get<IPurchaseLimitsResponse[]>(
      `/ramp-transactions/meld/sell-purchase-limits`,
      { params },
    );
    return data;
  }

  static async getCryptoQuote(payload: IQuotePayload): Promise<IQuoteResponse> {
    const { data } = await api.post<IQuoteResponse>(
      `/ramp-transactions/meld/quotes`,
      payload,
    );
    return data;
  }

  static async createWidget(data: ICreateWidgetPayload) {
    const { data: response } = await api.post<ICreateWidgetResponse>(
      '/ramp-transactions/meld/widget',
      data,
    );

    return response;
  }

  static async getWidgetUrl(id: string): Promise<{ widgetUrl: string }> {
    const { data } = await api.get<{ widgetUrl: string }>(
      `/ramp-transactions/${id}`,
    );
    return data;
  }

  static async getDestinationsBridge(
    payload: IGetDestinationPayload,
  ): Promise<IGetDestinationsResponse[]> {
    const { fromNetwork, fromToken } = payload;

    const { data } = await api.get<IGetDestinationsResponse[]>(
      `/layer-swap/destinations?fromNetwork=${fromNetwork}&fromToken=${fromToken}`,
    );

    return data;
  }

  static async getLimitsBridge({
    sourceNetwork,
    sourceToken,
    destinationNetwork,
    destinationToken,
  }: ICreateSwapBridgePayload): Promise<IGetLimitsResponse> {
    const params = new URLSearchParams({
      sourceNetwork,
      sourceToken,
      destinationNetwork,
      destinationToken,
    });

    const { data } = await api.get<IGetLimitsResponse>(
      `/layer-swap/limits?${params}`,
    );

    return data;
  }

  static async getQuoteBridge({
    sourceNetwork,
    sourceToken,
    destinationNetwork,
    destinationToken,
    amount,
  }: ICreateSwapBridgePayload): Promise<IGetQuotesResponse> {
    const params = new URLSearchParams({
      sourceNetwork,
      sourceToken,
      destinationNetwork,
      destinationToken,
      amount: String(amount),
    });

    const { data } = await api.get<IGetQuotesResponse>(
      `/layer-swap/quote?${params}`,
    );

    return data;
  }

  static async createSwapBridge(
    payload: ICreateSwapBridgePayload,
  ): Promise<ICreateSwapBridgeResponse> {
    const { data } = await api.post<ICreateSwapBridgeResponse>(
      `/layer-swap/swap`,
      payload,
    );

    return data;
  }

  static async updateSwapBridgeTransaction(
    payload: IUpdateSwapBridgeTxPayload,
  ): Promise<GetTransactionResponse> {
    const { data } = await api.put<GetTransactionResponse>(
      `/layer-swap/swap/${payload.hash}`,
      payload.swap,
    );

    return data;
  }
}
