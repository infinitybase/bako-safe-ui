import {
  AddressBookService,
  APITokenService,
  HomeService,
  NetworkService,
  NotificationService,
  SettingsService,
  TransactionService,
  UserService,
  VaultService,
  WorkspaceService,
} from '@bako-safe/services/modules';

import { apiConfig } from '@/config/api';

export const userService = new UserService(apiConfig);
export const transactionService = new TransactionService(apiConfig);
export const addressBookService = new AddressBookService(apiConfig);
export const apiTokenService = new APITokenService(apiConfig);
export const homeService = new HomeService(apiConfig);
export const notificationService = new NotificationService(apiConfig);
export const settingsService = new SettingsService(apiConfig);
export const vaultService = new VaultService(apiConfig);
export const workspaceService = new WorkspaceService(apiConfig);
export const networkService = new NetworkService(
  apiConfig,
  import.meta.env.VITE_APP_VERSION,
);
