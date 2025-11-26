import axios, { InternalAxiosRequestConfig } from 'axios';

import { jamMonitor } from '@/modules/core/services/jamMonitor';
import { GifLoadingRequestQueryKey } from '@/modules/workspace/hooks/useGifLoadingRequest';

import { CookieName, CookiesConfig } from './cookies';
import { queryClient } from './query-client';

// Extend axios config to store request metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _requestId?: string;
    _startTime?: number;
  }
}

const { VITE_API_URL } = import.meta.env;
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

export interface ISetupAxiosInterceptors {
  isTxFromDapp: boolean;
  isTokenExpired: boolean;
  setIsTokenExpired: (value: boolean) => void;
  logout: (removeTokenFromDb?: boolean) => void;
}

const api = axios.create({
  baseURL: VITE_API_URL,
  timeout: 10 * 1000, // limit to try other requests
});

// Generate unique request ID
const generateRequestId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const setupAxiosInterceptors = ({
  isTxFromDapp,
  isTokenExpired,
  setIsTokenExpired,
  logout,
}: ISetupAxiosInterceptors) => {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = CookiesConfig.getCookie(ACCESS_TOKEN);
      const address = CookiesConfig.getCookie(ADDRESS);

      if (accessToken) config.headers['authorization'] = accessToken;
      if (address) config.headers['signerAddress'] = address;

      // Add monitoring metadata
      config._requestId = generateRequestId();
      config._startTime = Date.now();

      // Log API call start with duplicate detection
      const endpoint = config.url?.replace(VITE_API_URL || '', '') || config.url || '';
      jamMonitor.apiCallStart({
        method: config.method?.toUpperCase() || 'GET',
        url: `${config.baseURL || ''}${config.url || ''}`,
        endpoint,
        requestId: config._requestId,
        params: config.params,
      });

      return config;
    },
    (error) => error,
  );

  api.interceptors.response.use(
    async (response) => {
      // Log successful API call
      const config = response.config;
      const duration = config._startTime ? Date.now() - config._startTime : 0;
      const endpoint = config.url?.replace(VITE_API_URL || '', '') || config.url || '';

      jamMonitor.apiCallSuccess({
        method: config.method?.toUpperCase() || 'GET',
        url: `${config.baseURL || ''}${config.url || ''}`,
        endpoint,
        requestId: config._requestId || '',
        status: response.status,
        duration,
        responseSize: JSON.stringify(response.data).length,
      });

      return response;
    },
    async (error) => {
      // Log API error
      const config = error.config;
      if (config) {
        const duration = config._startTime ? Date.now() - config._startTime : 0;
        const endpoint = config.url?.replace(VITE_API_URL || '', '') || config.url || '';

        jamMonitor.apiCallError({
          method: config.method?.toUpperCase() || 'GET',
          url: `${config.baseURL || ''}${config.url || ''}`,
          endpoint,
          requestId: config._requestId || '',
          status: error.response?.status,
          error: error.message || error.response?.data?.detail || 'Unknown error',
          duration,
        });
      }

      const unauthorizedError = error.response?.status === 401;

      if (unauthorizedError && !isTokenExpired && !isTxFromDapp) {
        const tokenExpiredError =
          error.response?.title === ApiUnauthorizedErrorsTitles.EXPIRED_TOKEN;

        setIsTokenExpired(true);
        logout(tokenExpiredError);
        queryClient.invalidateQueries({
          queryKey: [GifLoadingRequestQueryKey.ANIMATION_LOADING],
        });
      }

      return Promise.reject(error);
    },
  );
};

export { api, setupAxiosInterceptors };
