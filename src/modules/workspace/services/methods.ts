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

export interface UpdateWorkspaceMembersPayload {
  id: Workspace['id'];
  members: string[];
}

export interface UpdateWorkspacePermissionsPayload {
  id: Workspace['id'];
  permissions: IPermissions;
}

export interface SelectWorkspacePayload {
  workspace_id: string;
  address: string;
  token: string;
}

export type ListUserWorkspacesResponse = Workspace[];
export type CreateWorkspaceResponse = Workspace;
export type UpdateWorkspaceMembersResponse = Workspace;
export type UpdateWorkspacePermissionsResponse = Workspace;
export type GetWorkspaceByIdResponse = Workspace;
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

  static async updateMembers(payload: UpdateWorkspaceMembersPayload) {
    const { data } = await api.put<UpdateWorkspaceMembersResponse>(
      `/workspace/${payload.id}/members`,
      { members: payload.members },
    );

    return data;
  }

  static async updatePermissions(payload: UpdateWorkspacePermissionsPayload) {
    const { data } = await api.put<UpdateWorkspacePermissionsResponse>(
      `/workspace/${payload.id}/permissions`,
      { permissions: payload.permissions },
    );

    return data;
  }

  static async getById(workspaceId: string) {
    const { data } = await api.get<GetWorkspaceByIdResponse>(
      `/workspace/${workspaceId}`,
    );

    return data;
  }
}
