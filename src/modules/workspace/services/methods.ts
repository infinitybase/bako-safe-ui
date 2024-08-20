import { ITransaction } from 'bakosafe';
import { BN } from 'fuels';

import { api } from '@/config';
import {
  IPagination,
  IPermission,
  IPermissions,
  Predicate,
  Workspace,
} from '@/modules/core';

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
      }, 500);
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
    const { data } =
      await api.get<GetWorkspaceBalanceResponse>(`/workspace/balance`);

    return data;
  }

  static async deleteMember(payload: DeleteWorkspaceMemberPayload) {
    const { member } = payload;
    const { data } = await api.post<UpdateWorkspaceMembersResponse>(
      `/workspace/members/${member}/remove`,
    );

    return data;
  }
}
