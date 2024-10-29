import { CookieName, CookiesConfig } from '@/config/cookies';

import { IGenerateRedirectQueryParams } from './types';

const authCredentials = () => ({
  token: CookiesConfig.getCookie(CookieName.ACCESS_TOKEN),
  address: CookiesConfig.getCookie(CookieName.ADDRESS),
});

const authCredentialsByKey = (key: 'token' | 'address') => {
  const credentials = authCredentials();
  const hasCredential = key in credentials;

  if (!hasCredential) {
    throw new Error('Key not found in credentials');
  }

  return credentials[key];
};

const generateRedirectQueryParams = ({
  sessionId,
  origin,
  name,
  request_id,
  byConnector,
}: IGenerateRedirectQueryParams) => {
  const queryParams = [
    sessionId && `sessionId=${sessionId}`,
    origin && `origin=${origin}`,
    name && `name=${name}`,
    request_id && `request_id=${request_id}`,
    byConnector && `byConnector=${byConnector}`,
  ]
    .filter(Boolean)
    .join('&');

  return queryParams ? `?${queryParams}` : '';
};

const localStorageKeys = {
  HARDWARE_ID: 'bakosafe/hardwareId',
  WEB_AUTHN_LAST_LOGIN_USERNAME: 'bakosafe/web-authn-last-login-username',
  NETWORKS: 'bakosafe/networks/list',
  SELECTED_CHAIN_ID: 'bakosafe/selected-chain-id',
  SELECTED_NETWORK: 'bakosafe/selected-network',
};

const UserQueryKey = {
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

export {
  authCredentials,
  authCredentialsByKey,
  generateRedirectQueryParams,
  localStorageKeys,
  UserQueryKey,
};
