import { api } from "@/config";
import { AxiosInstance } from "axios";

export interface GetSettingsResponse {
  id: string;
  email?: string;
  name?: string;
  first_login: boolean;
  notify: boolean;
}

export type UpdateSettingsPayload = {
  id: string;
  notify?: string;
  name?: string;
  email?: string;
  first_login?: boolean;
};
export type UpdateSettingsResponse = boolean;

export class SettingsService {
  static async updateSettings({ id, ...rest }: UpdateSettingsPayload) {
    const { data } = await api.put<UpdateSettingsResponse>(`/user/${id}`, rest);
    return data;
  }

  static async getSettings() {
    const { data } = await api.get<GetSettingsResponse>(`/user/info`);
    return data;
  }
}
