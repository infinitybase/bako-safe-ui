import { NotificationSummary, NotificationTitle } from './types';

const notificationDescription = (
  title: NotificationTitle,
  summary: NotificationSummary,
) => {
  const { vaultName, transactionName } = summary;

  const descriptions = {
    [NotificationTitle.NEW_VAULT_CREATED]: `The '${vaultName}' has been created, and you are a signer!`,
    [NotificationTitle.TRANSACTION_CREATED]: `The transaction '${transactionName}' has been created on the '${vaultName}' vault.`,
    [NotificationTitle.TRANSACTION_SIGNED]: `The transaction '${transactionName}' has been signed in the '${vaultName}' vault.`,
    [NotificationTitle.TRANSACTION_COMPLETED]: `The transaction '${transactionName}' has been completed in the '${vaultName}' vault.`,
    [NotificationTitle.TRANSACTION_DECLINED]: `The transaction '${transactionName}' has been declined in the '${vaultName}' vault.`,
  };

  return descriptions[title];
};

export { notificationDescription };

export enum NotificationsQueryKey {
  PAGINATED_LIST = 'notifications/pagination',
  READ_ALL = 'notifications/read-all',
  UNREAD_COUNTER = 'notifications/unread-counter',
}
