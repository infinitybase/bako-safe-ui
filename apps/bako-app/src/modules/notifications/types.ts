export interface NotificationSummary {
  vaultId: string;
  vaultName: string;
  transactionId?: string;
  transactionName?: string;
  workspaceId: string;
}
export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
}
export enum NotificationTitle {
  TRANSACTION_CREATED = 'Transaction Created',
  TRANSACTION_COMPLETED = 'Transaction Completed',
  TRANSACTION_DECLINED = 'Transaction Declined',
  TRANSACTION_SIGNED = 'Transaction Signed',
  NEW_VAULT_CREATED = 'New Vault Created',
}

export interface Notification {
  id: string;
  title: NotificationTitle;
  summary: NotificationSummary;
  read: boolean;
  createdAt: string;
}
