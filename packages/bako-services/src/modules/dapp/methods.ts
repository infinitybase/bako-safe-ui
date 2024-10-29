import { api } from "@/config";
import { TransactionRequestLike } from "fuels";

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
}
