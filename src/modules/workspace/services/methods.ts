import { api } from '@/config';
import { IPermissions, Workspace } from '@/modules/core';

export interface CreateWorkspacePayload {
  name: string;
  members?: string[];
  description?: string;
  avatar?: string;
  single?: boolean;
  permissions?: IPermissions;
}

export interface SelectWorkspacePayload {
  workspace_id: string;
  address: string;
  token: string;
}

export type ListUserWorkspacesResponse = Workspace[];
export type CreateWorkspaceResponse = Workspace;
export type SelectWorkspaceResponse = {
  workspace: Workspace;
};

export class WorkspaceService {
  static async list(userAddress: string) {
    const { data } = await api.get<ListUserWorkspacesResponse>(
      `/workspace/by-user/${userAddress}`,
    );

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

    return data;
  }
}
