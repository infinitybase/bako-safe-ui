import { AxiosInstance } from "axios";
import { SortOption, IPagination, PaginationParams } from "@/types";
export interface GetAllNotificationsPayload extends PaginationParams {
  unread?: boolean;
  orderBy?: string;
  sort?: SortOption;
}

export interface NotificationSummary {
  vaultId: string;
  vaultName: string;
  transactionId?: string;
  transactionName?: string;
  workspaceId: string;
}
export enum NotificationStatus {
  UNREAD = "UNREAD",
  READ = "READ",
}
export enum NotificationTitle {
  TRANSACTION_CREATED = "Transaction Created",
  TRANSACTION_COMPLETED = "Transaction Completed",
  TRANSACTION_DECLINED = "Transaction Declined",
  TRANSACTION_SIGNED = "Transaction Signed",
  NEW_VAULT_CREATED = "New Vault Created",
}

export interface Notification {
  id: string;
  title: NotificationTitle;
  summary: NotificationSummary;
  read: boolean;
  createdAt: string;
}

export type SetAllAsReadResponse = boolean;
export type GetAllNotificationsPaginationResponse = IPagination<Notification>;

export class NotificationService {
  api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getAllWithPagination(params: GetAllNotificationsPayload) {
    const { data } = await this.api.get<GetAllNotificationsPaginationResponse>(
      "/notifications",
      { params },
    );

    return data;
  }

  async setAllAsRead() {
    const { data } = await this.api.put<SetAllAsReadResponse>(
      "/notifications/read-all",
    );

    return data;
  }
}
