export enum Encoder {
  FUEL = 'FUEL',
  METAMASK = 'METAMASK',
  WEB_AUTHN = 'WEB_AUTHN',
}

export const localStorageKeys = {
  HARDWARE_ID: 'bakosafe/hardwareId',
  WEB_AUTHN_LAST_LOGIN_USERNAME: 'bakosafe/web-authn-last-login-username',
  NETWORKS: 'bakosafe/networks/list',
  SELECTED_CHAIN_ID: 'bakosafe/selected-chain-id',
  SELECTED_NETWORK: 'bakosafe/selected-network',
};

export const UserQueryKey = {
  DEFAULT: 'user',
  HARDWARE_ID: () => [UserQueryKey.DEFAULT, 'hardware-id'],
  CREATE_HARDWARE_ID: () => [UserQueryKey.DEFAULT, 'create-hardware-id'],
  CREATE_WEB_AUTHN_ACCOUNT: () => [
    UserQueryKey.DEFAULT,
    'create-web-authn-account',
  ],
  SIGN_MESSAGE_WEB_AUTHN: () => [
    UserQueryKey.DEFAULT,
    'sign-message-web-authn',
  ],
  // HARDWARE_ID: () => [UserQueryKey.DEFAULT, 'hardware-id'],
  ACCOUNTS: (hardwareId: string) => [
    UserQueryKey.DEFAULT,
    'accounts',
    hardwareId,
  ],
  NICKNAME: (search: string, userId?: string) => [
    UserQueryKey.DEFAULT,
    'nickname',
    search,
    userId,
  ],
  FULL_DATA: (search: string, hardwareId: string) => [
    UserQueryKey.DEFAULT,
    UserQueryKey.NICKNAME(search),
    // UserQueryKey.HARDWARE_ID(),
    UserQueryKey.ACCOUNTS(hardwareId),
  ],
};
