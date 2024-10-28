import { IWitnesses, TransactionStatus } from "bakosafe";
import { assets, Assets, BN } from "fuels";
import { Predicate } from "../vault/types";
import { IPagination } from "@/types";
import { ITransaction } from "../transaction";
import { IPermission, IPermissions, Workspace } from "./types";
import { AxiosInstance } from "axios";

// import {
//   IPagination,
//   IPermission,
//   IPermissions,
//   Predicate,
//   WitnessStatus,
//   Workspace,
// } from "@app/modules/core";

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

export class WorkspaceService {
  api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async list() {
    const { data } =
      await this.api.get<ListUserWorkspacesResponse>(`/workspace/by-user`);

    return data;
  }

  async create(payload: CreateWorkspacePayload) {
    const { data } = await this.api.post<CreateWorkspaceResponse>(
      `/workspace`,
      payload,
    );

    return data;
  }

  async select(payload: SelectWorkspacePayload) {
    const { data } = await this.api.put<SelectWorkspaceResponse>(
      `/auth/workspace`,
      payload,
    );

    return new Promise<SelectWorkspaceResponse>((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 900);
    });
  }

  async includeMember(payload: IncludeWorkspaceMemberPayload) {
    const { address } = payload;
    const { data } = await this.api.post<IncludeWorkspaceMemberResponse>(
      `/workspace/members/${address}/include`,
    );

    return data;
  }

  async updatePermissions(payload: UpdateWorkspacePermissionsPayload) {
    const { permissions, member } = payload;
    const { data } = await this.api.put<UpdateWorkspacePermissionsResponse>(
      `/workspace/permissions/${member}`,
      { permissions },
    );

    return data;
  }

  async getById(workspaceId: string) {
    const { data } = await this.api.get<GetWorkspaceByIdResponse>(
      `/workspace/${workspaceId}`,
    );

    return data;
  }

  async getBalance() {
    return new Promise<IWroskapceBalance>((resolve) => {
      resolve({
        currentBalanceUSD: "0",
        currentBalance: [],
      });
    });
  }

  async getFuelTokensList(): Promise<Assets> {
    const response = await fetch(
      "https://verified-assets.fuel.network/assets.json",
    );

    if (!response.ok) {
      return assets;
    }

    const data: Assets = await response.json();
    return data;
  }

  async deleteMember(payload: DeleteWorkspaceMemberPayload) {
    const { member } = payload;
    const { data } = await this.api.post<UpdateWorkspaceMembersResponse>(
      `/workspace/members/${member}/remove`,
    );

    return data;
  }
}
