import { Network, TransactionRequestLike } from 'fuels';

import { api } from '@/config/api';

interface GetCurrentVaultResponse {}
export interface IDAppCreatePayload {
  sessionId: string;
  name: string;
  origin: string;
  vaultId: string;
  userAddress: string;
  request_id: string;
}

export interface IDAPPConfirmTx {
  sessionId: string;
  vaultAddress: string;
  code: string;
  tx: TransactionRequestLike;
}

export interface IDAPPChangeNetwork {
  sessionId: string;
  newNetwork: Network;
  origin: string;
}

export class DAppService {
  static async findCurrentBySessionId(sessionId: string) {
    const { data } = await api.get<GetCurrentVaultResponse>(
      `/connections/${sessionId}`,
    );
    return data;
  }

  static async create(params: IDAppCreatePayload) {
    const { data } = await api.post<IDAppCreatePayload>(`/connections`, params);
    return data;
  }

  static async confirmTx(params: IDAPPConfirmTx) {
    const { data } = await api.post<void>(`/connections/tx/confirm`, params);
    return data;
  }

  static async changeNetwork(params: IDAPPChangeNetwork) {
    const { data } = await api.put<Network>(
      `/connections/${params.sessionId}/network`,
      params,
    );
    return data;
  }
}
