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
  api: AxiosInstance;
  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async updateSettings({ id, ...rest }: UpdateSettingsPayload) {
    const { data } = await this.api.put<UpdateSettingsResponse>(
      `/user/${id}`,
      rest,
    );
    return data;
  }

  async getSettings() {
    const { data } = await this.api.get<GetSettingsResponse>(`/user/info`);
    return data;
  }
}
