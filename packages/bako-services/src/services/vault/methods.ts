import { BN, CoinQuantity } from "fuels";

import { Asset, IPagination, NFT, PaginationParams, SortOption } from "@/types";
import { Workspace } from "../workspace/types";
import { IPredicate, Predicate } from "./types";
import { AxiosInstance } from "axios";

export interface GetAllPredicatesPayload extends PaginationParams {
  q?: string;
  address?: string;
  signer?: string;
  provider?: string;
  owner?: string;
  orderBy?: string;
  sort?: SortOption;
  orderByRoot?: boolean;
}

export interface HasReservedCoins {
  currentBalanceUSD: string;
  reservedCoins: CoinQuantity[];
  currentBalance: Required<Asset>[];
  nfts: NFT[];
}

export type PredicateWorkspace = Omit<Workspace, "permissions">;
export type PredicateAndWorkspace = Predicate & {
  workspace: PredicateWorkspace;
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
  "id" | "transactions" | "completeAddress" | "owner"
>;

export class VaultService {
  api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async create(payload: CreatePredicatePayload) {
    const { data } = await this.api.post<CreatePredicateResponse>(
      "/predicate",
      payload,
    );
    return data;
  }

  async getAllWithPagination(params: GetAllPredicatesPayload) {
    const { data } = await this.api.get<GetAllPredicatePaginationResponse>(
      "/predicate",
      {
        params,
      },
    );

    return data;
  }

  async getById(id: string) {
    const { data } = await this.api.get<PredicateResponseWithWorkspace>(
      `/predicate/${id}`,
    );
    return data;
  }

  async getByAddress(address: string) {
    const { data } = await this.api.get<PredicateResponseWithWorkspace>(
      `/predicate/by-address/${address}`,
    );
    return data;
  }

  async getByName(name: string) {
    const { data } = await this.api.get<boolean>(`/predicate/by-name/${name}`);
    return data;
  }

  async checkByAddress(address: string) {
    const { data } = await this.api.get<boolean>(
      `/predicate/check/by-address/${address}`,
    );
    return data;
  }

  async findPredicates(address: string) {
    const { data } = await this.api.get<GetAllPredicateResponse>(`/predicate`, {
      data: {
        signer: address,
      },
    });
    return data;
  }

  async hasReservedCoins(predicateId: string): Promise<HasReservedCoins> {
    const { data } = await this.api.get<HasReservedCoins>(
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
}
