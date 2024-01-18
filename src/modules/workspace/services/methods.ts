import { api } from '@/config';
import { Workspace } from '@/modules/core';

export type ListUserWorkspacesResponse = Workspace[];

export class WorkspaceService {
  static async list(userAddress: string) {
    const { data } = await api.get<ListUserWorkspacesResponse>(
      `/workspace/by-user/${userAddress}`,
    );

    return data;
  }
}
