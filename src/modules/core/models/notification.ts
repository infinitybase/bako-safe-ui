export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
}

export interface Notification {
  id: string;
  title: string;
  createdAt: string;
  description: string;
  redirect: string;
  read: boolean;
}
