import { api } from "@/config";
import { SortOption, IPagination, PaginationParams } from "@/types";
export interface GetAllNotificationsPayload extends PaginationParams {
  unread?: boolean;
  orderBy?: string;
  sort?: SortOption;
}

export type SetAllAsReadResponse = boolean;
export type GetAllNotificationsPaginationResponse = IPagination<Notification>;

export class NotificationService {
  static async getAllWithPagination(params: GetAllNotificationsPayload) {
    const { data } = await api.get<GetAllNotificationsPaginationResponse>(
      "/notifications",
      { params },
    );

    return data;
  }

  static async setAllAsRead() {
    const { data } = await api.put<SetAllAsReadResponse>(
      "/notifications/read-all",
    );

    return data;
  }
}
