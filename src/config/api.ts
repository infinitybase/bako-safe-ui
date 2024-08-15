import axios from 'axios';

import { CookieName, CookiesConfig } from './cookies';

const { VITE_API_URL } = import.meta.env;
const { ACCESS_TOKEN, ADDRESS, SINGLE_WORKSPACE } = CookieName;

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

const api = axios.create({
  baseURL: VITE_API_URL,
  timeout: 10 * 1000, // limit to try other requests
});

api.interceptors.request.use(
  (value) => {
    const accessToken = CookiesConfig.getCookie(ACCESS_TOKEN);
    const address = CookiesConfig.getCookie(ADDRESS);

    if (accessToken) value.headers['authorization'] = accessToken;
    if (address) value.headers['signerAddress'] = address;

    return value;
  },
  (error) => error,
);

api.interceptors.response.use(
  async (config) => config,
  async (error) => {
    const unauthorizedError = error.response?.status === 401;

    if (unauthorizedError) {
      CookiesConfig.removeCookies([ACCESS_TOKEN, ADDRESS, SINGLE_WORKSPACE]);
    }

    return Promise.reject(error);
  },
);

export { api };
