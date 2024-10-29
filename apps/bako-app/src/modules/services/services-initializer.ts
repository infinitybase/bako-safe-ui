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
import { useMemo } from 'react';

import { api } from '@/config';

type ServiceMap = {
  userService: UserService;
  transactionService: TransactionService;
  addressBookService: AddressBookService;
  apiTokenService: APITokenService;
  dappService: DAppService;
  homeService: HomeService;
  notificationService: NotificationService;
  settingsService: SettingsService;
  vaultService: VaultService;
  workspaceService: WorkspaceService;
};

export const useBakoServices = () => {
  const services = useMemo(() => {
    const serviceClasses = {
      userService: UserService,
      transactionService: TransactionService,
      addressBookService: AddressBookService,
      apiTokenService: APITokenService,
      dappService: DAppService,
      homeService: HomeService,
      notificationService: NotificationService,
      settingsService: SettingsService,
      vaultService: VaultService,
      workspaceService: WorkspaceService,
    };

    return Object.entries(serviceClasses).reduce((acc, [key, ServiceClass]) => {
      (acc as Partial<ServiceMap>)[key as keyof ServiceMap] = new ServiceClass(
        api,
      );
      return acc;
    }, {} as Partial<ServiceMap>) as ServiceMap; // Cast final result to ServiceMap
  }, [api]);

  return services;

  // const services = useMemo(
  //   () => ({
  //     userService: new UserService(api),
  //     transactionService: new TransactionService(api),
  //     addressBookService: new AddressBookService(api),
  //     apiTokenService: new APITokenService(api),
  //     dappService: new DAppService(api),
  //     homeService: new HomeService(api),
  //     notificationService: new NotificationService(api),
  //     settingsService: new SettingsService(api),
  //     vaultService: new VaultService(api),
  //     workspaceService: new WorkspaceService(api),
  //   }),
  //   [],
  // );

  // return services;
};
