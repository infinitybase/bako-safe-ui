import { api } from '@/config/api';

interface GetCurrentVaultResponse {}

export class DAppService {
  static async findCurrentBySessionId(sessionId: string) {
    const { data } = await api.get<GetCurrentVaultResponse>(
      `/connections/${sessionId}`,
    );
    return data;
  }
}
