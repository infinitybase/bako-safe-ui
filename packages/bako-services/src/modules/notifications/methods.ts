import { SortOption, IPagination, PaginationParams } from "@/types";
import { AxiosInstance } from "axios";
import { Notification } from "./types";
export interface GetAllNotificationsPayload extends PaginationParams {
  unread?: boolean;
  orderBy?: string;
  sort?: SortOption;
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
