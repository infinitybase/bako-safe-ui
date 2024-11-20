import { AxiosInstance, AxiosResponse } from 'axios';

import { CookieName, CookiesConfig } from './cookies';

const { ACCESS_TOKEN, ADDRESS } = CookieName;

export enum ApiUnauthorizedErrorsTitles {
  MISSING_CREDENTIALS = 'Missing credentials',
  SESSION_NOT_FOUND = 'Session not found',
  INVALID_ADDRESS = 'Invalid address',
  EXPIRED_TOKEN = 'Expired token',
}

export type IApiErrorTypes =
  | 'CreateException'
  | 'UpdateException'
  | 'DeleteException'
  | 'NotFound'
  | 'Unauthorized'
  | 'Internal';

export interface IApiError {
  type: IApiErrorTypes;
  title: string | ApiUnauthorizedErrorsTitles;
  detail: string;
}

class AxiosSetup {
  private static instance: AxiosSetup;
  private apiConfig: AxiosInstance;
  private logout: () => void;

  private constructor(apiConfig: AxiosInstance, logout: () => void) {
    this.apiConfig = apiConfig;
    this.logout = logout;
  }

  public static getInstance(
    apiConfig: AxiosInstance,
    logout: () => void,
  ): AxiosSetup {
    if (!AxiosSetup.instance) {
      AxiosSetup.instance = new AxiosSetup(apiConfig, logout);
    }
    return AxiosSetup.instance;
  }

  public init(): void {
    this.apiConfig.interceptors.request.use(
      (value) => {
        const accessToken = CookiesConfig.getCookie(ACCESS_TOKEN);
        const address = CookiesConfig.getCookie(ADDRESS);

        if (accessToken) value.headers['authorization'] = accessToken;
        if (address) value.headers['signerAddress'] = address;

        return value;
      },
      (error) => error,
    );

    this.apiConfig.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const unauthorizedError = error.response?.status === 401;

        if (unauthorizedError) {
          this.logout();
        }

        return Promise.reject(error);
      },
    );
  }
}

export { AxiosSetup };
