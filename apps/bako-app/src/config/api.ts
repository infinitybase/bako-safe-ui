import { AxiosSetup } from '@bako-safe/services';
import axios from 'axios';

import { CookieName, CookiesConfig } from '@/modules';
import { GifLoadingRequestQueryKey } from '@/modules/workspace/hooks/useGifLoadingRequest';

import { queryClient } from './query-client';

const { VITE_API_URL } = import.meta.env;

export const apiConfig = axios.create({
  baseURL: VITE_API_URL,
  timeout: 10 * 1000, // limit to try other requests
});

interface IinitiAxiosSetup {
  isTxFromDapp: boolean;
  isTokenExpired: boolean;
  setIsTokenExpired: (value: boolean) => void;
  logout: (removeTokenFromDb?: boolean, callback?: () => void) => Promise<void>;
}

// TODO: Need do adjust in th App.tsx first and then adjust logout fn here
const initiAxiosSetup = ({
  isTokenExpired,
  isTxFromDapp,
  setIsTokenExpired,
  logout,
}: IinitiAxiosSetup) => {
  const accessToken = CookiesConfig.getCookie(CookieName.ACCESS_TOKEN);
  const signerAddress = CookiesConfig.getCookie(CookieName.ADDRESS);

  const handleLogout = () =>
    // params?: LogoutParams
    {
      if (!isTokenExpired && !isTxFromDapp) {
        setIsTokenExpired(true);

        logout(true);
        // logout(params?.isExpiredTokenError);
        queryClient.invalidateQueries({
          queryKey: [GifLoadingRequestQueryKey.ANIMATION_LOADING],
        });
      }
    };

  const instance = AxiosSetup.getInstance(
    {
      accessToken,
      signerAddress,
      logout: handleLogout,
    },
    apiConfig,
  );

  return instance;
};

export { initiAxiosSetup };
