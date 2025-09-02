import { TransactionStatus } from 'bakosafe';
import { Assets, assets, BN } from 'fuels';

import { api } from '@/config';
import { useMappedAssetStore } from '@/modules/assets-tokens/hooks/useAssetMap';
import {
  AssetMap,
  IPagination,
  IPermission,
  IPermissions,
  Predicate,
  WitnessStatus,
  Workspace,
} from '@/modules/core';
import { ITransaction } from '@/modules/core/hooks/bakosafe/utils/types';
import { FIAT_CURRENCIES_ASSET_MAP } from '@/modules/core/utils/fiat-currencies';
import { request } from '@/utils/request';

export interface IWitnesses {
  account: string;
  signature: string;
  status: WitnessStatus;
  updatedAt: string;
}

export interface ITransactionResume {
  id: string;
  hash: string;
  totalSigners: number;
  requiredSigners: number;
  predicate: {
    id: string;
    address: string;
  };
  status: TransactionStatus;
  witnesses: IWitnesses[];
  gasUsed?: string;
  sendTime?: Date;
  error?: string;
}

export interface CreateWorkspacePayload {
  name: string;
  members?: string[];
  description?: string;
  avatar?: string;
  single?: boolean;
  permissions?: IPermissions;
}

export interface WorkspaceHomeResponse {
  predicates: IPagination<Predicate>;
  transactions: IPagination<ITransaction & { predicate: Predicate }>;
}

export interface IncludeWorkspaceMemberPayload {
  address: string;
}

export interface UpdateWorkspacePermissionsPayload {
  member: string;
  permissions: IPermission;
}
export interface DeleteWorkspaceMemberPayload {
  member: string;
}

export interface SelectWorkspacePayload {
  workspace: string;
  user: string;
}

export type ListUserWorkspacesResponse = Workspace[];
export type CreateWorkspaceResponse = Workspace;
export type UpdateWorkspaceMembersResponse = Workspace;
export type IncludeWorkspaceMemberResponse = Workspace;
export type UpdateWorkspacePermissionsResponse = Workspace;
export type GetWorkspaceByIdResponse = Workspace;
export type SelectWorkspaceResponse = {
  workspace: Workspace;
};

export type IWroskapceBalance = {
  currentBalanceUSD: string;
  currentBalance: {
    assetId: string;
    amount: BN;
  }[];
};

export type GetWorkspaceBalanceResponse = IWroskapceBalance;

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class WorkspaceService {
  static async list() {
    const { data } =
      await api.get<ListUserWorkspacesResponse>(`/workspace/by-user`);

    return data;
  }

  static async create(payload: CreateWorkspacePayload) {
    const { data } = await api.post<CreateWorkspaceResponse>(
      `/workspace`,
      payload,
    );

    return data;
  }

  static async select(payload: SelectWorkspacePayload) {
    const { data } = await api.put<SelectWorkspaceResponse>(
      `/auth/workspace`,
      payload,
    );

    return new Promise<SelectWorkspaceResponse>((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 900);
    });
  }

  static async includeMember(payload: IncludeWorkspaceMemberPayload) {
    const { address } = payload;
    const { data } = await api.post<IncludeWorkspaceMemberResponse>(
      `/workspace/members/${address}/include`,
    );

    return data;
  }

  static async updatePermissions(payload: UpdateWorkspacePermissionsPayload) {
    const { permissions, member } = payload;
    const { data } = await api.put<UpdateWorkspacePermissionsResponse>(
      `/workspace/permissions/${member}`,
      { permissions },
    );

    return data;
  }

  static async getById(workspaceId: string) {
    const { data } = await api.get<GetWorkspaceByIdResponse>(
      `/workspace/${workspaceId}`,
    );

    return data;
  }

  static async getBalance() {
    return new Promise<IWroskapceBalance>((resolve) => {
      resolve({
        currentBalanceUSD: '0',
        currentBalance: [],
      });
    });
  }

  static async getFuelTokensList(): Promise<Assets> {
    const response = await fetch(
      'https://verified-assets.fuel.network/assets.json',
    );

    if (!response.ok) {
      return assets;
    }

    const data: Assets = await response.json();
    const atualObj = useMappedAssetStore.getState().mappedTokens;

    return [...Object.values(atualObj).map((item) => item), ...data] as Assets;
  }

  static async getTokenFuelApi(assetId: string, chainId: number) {
    const fiatCurrency = FIAT_CURRENCIES_ASSET_MAP[assetId];
    if (fiatCurrency) {
      return fiatCurrency;
    }
    const _chainId: { [key: number]: string } = {
      [9889]: 'https://mainnet-explorer.fuel.network',
      [0]: 'https://explorer-indexer-testnet.fuel.network',
    };

    const url = `${_chainId[chainId]}/assets/${assetId}`;

    const response = await request<AssetMap['']>(url);

    return response;
  }

  static async deleteMember(payload: DeleteWorkspaceMemberPayload) {
    const { member } = payload;
    const { data } = await api.post<UpdateWorkspaceMembersResponse>(
      `/workspace/members/${member}/remove`,
    );

    return data;
  }
}
