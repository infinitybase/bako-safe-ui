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

export type ListUserWorkspacesResponse = Workspace[];
export type CreateWorkspaceResponse = Workspace;

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
}
