import {
  AddressBookService,
  APITokenService,
  HomeService,
  NotificationService,
  SettingsService,
  TransactionService,
  UserService,
  VaultService,
  WorkspaceService,
} from '@bako-safe/services/modules';

import { api } from '@/config';

// export const useBakoServices = () => {
//   const services = useMemo(
//     () => ({
//       userService: new UserService(api),
//       transactionService: new TransactionService(api),
//       addressBookService: new AddressBookService(api),
//       apiTokenService: new APITokenService(api),
//       dappService: new DAppService(api),
//       homeService: new HomeService(api),
//       notificationService: new NotificationService(api),
//       settingsService: new SettingsService(api),
//       vaultService: new VaultService(api),
//       workspaceService: new WorkspaceService(api),
//     }),
//     [api],
//   );

//   return services;
// };

// export const bakoServices = {
//   userService: new UserService(api),
//   transactionService: new TransactionService(api),
//   addressBookService: new AddressBookService(api),
//   apiTokenService: new APITokenService(api),
//   dappService: new DAppService(api),
//   homeService: new HomeService(api),
//   notificationService: new NotificationService(api),
//   settingsService: new SettingsService(api),
//   vaultService: new VaultService(api),
//   workspaceService: new WorkspaceService(api),
// };
export const userService = new UserService(api);
export const transactionService = new TransactionService(api);
export const addressBookService = new AddressBookService(api);
export const apiTokenService = new APITokenService(api);
export const homeService = new HomeService(api);
export const notificationService = new NotificationService(api);
export const settingsService = new SettingsService(api);
export const vaultService = new VaultService(api);
export const workspaceService = new WorkspaceService(api);
