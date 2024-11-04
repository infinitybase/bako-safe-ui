import {
  AddressBookService,
  APITokenService,
  DAppService,
  HomeService,
  NotificationService,
  SettingsService,
  TransactionService,
  UserService,
  VaultService,
  WorkspaceService,
} from '@bako-safe/services/modules';

import { api } from '@/config';

export const userService = new UserService(api);
export const transactionService = new TransactionService(api);
export const addressBookService = new AddressBookService(api);
export const apiTokenService = new APITokenService(api);
export const homeService = new HomeService(api);
export const notificationService = new NotificationService(api);
export const settingsService = new SettingsService(api);
export const vaultService = new VaultService(api);
export const workspaceService = new WorkspaceService(api);
export const dappService = new DAppService(api);