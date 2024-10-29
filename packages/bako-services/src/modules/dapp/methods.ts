import { AxiosInstance } from "axios";
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
  api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async findCurrentBySessionId(sessionId: string) {
    const { data } = await this.api.get<GetCurrentVaultResponse>(
      `/connections/${sessionId}`,
    );
    return data;
  }

  async create(params: IDAppCreatePayload) {
    const { data } = await this.api.post<IDAppCreatePayload>(
      `/connections`,
      params,
    );
    return data;
  }

  async confirmTx(params: IDAPPConfirmTx) {
    const { data } = await this.api.post<void>(
      `/connections/tx/confirm`,
      params,
    );
    return data;
  }
}
