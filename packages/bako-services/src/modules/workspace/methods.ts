import { assets, Assets } from "fuels";
import {
  CreateWorkspacePayload,
  CreateWorkspaceResponse,
  DeleteWorkspaceMemberPayload,
  GetWorkspaceByIdResponse,
  IncludeWorkspaceMemberPayload,
  IncludeWorkspaceMemberResponse,
  IWroskapceBalance,
  ListUserWorkspacesResponse,
  SelectWorkspacePayload,
  SelectWorkspaceResponse,
  UpdateWorkspaceMembersResponse,
  UpdateWorkspacePermissionsPayload,
  UpdateWorkspacePermissionsResponse,
} from "./types";
import { api } from "@/config";

export class WorkspaceService {
  async list() {
    const { data } =
      await api.get<ListUserWorkspacesResponse>(`/workspace/by-user`);

    return data;
  }

  async create(payload: CreateWorkspacePayload) {
    const { data } = await api.post<CreateWorkspaceResponse>(
      `/workspace`,
      payload,
    );

    return data;
  }

  async select(payload: SelectWorkspacePayload) {
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

  async includeMember(payload: IncludeWorkspaceMemberPayload) {
    const { address } = payload;
    const { data } = await api.post<IncludeWorkspaceMemberResponse>(
      `/workspace/members/${address}/include`,
    );

    return data;
  }

  async updatePermissions(payload: UpdateWorkspacePermissionsPayload) {
    const { permissions, member } = payload;
    const { data } = await api.put<UpdateWorkspacePermissionsResponse>(
      `/workspace/permissions/${member}`,
      { permissions },
    );

    return data;
  }

  async getById(workspaceId: string) {
    const { data } = await api.get<GetWorkspaceByIdResponse>(
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
    const { data } = await api.post<UpdateWorkspaceMembersResponse>(
      `/workspace/members/${member}/remove`,
    );

    return data;
  }
}
