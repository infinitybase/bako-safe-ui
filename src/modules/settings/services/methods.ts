import { api } from '@/config';

export type UpdateSettingsPayload = {
  id: string;
  notify: string;
  name?: string;
  email?: string;
  // first_login?: boolean;
};
export type UpdateSettingsResponse = boolean;

export class SettingsService {
  static async updateSettings({ id, ...rest }: UpdateSettingsPayload) {
    const { data } = await api.put<UpdateSettingsResponse>(`/user/${id}`, rest);
    return data;
  }
}
