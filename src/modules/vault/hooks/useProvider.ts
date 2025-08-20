import { Provider } from 'fuels';
import { useMemo } from 'react';

export const useProvider = (url: string | undefined) => {
  return useMemo(() => {
    return new Provider(url || import.meta.env.VITE_MAINNET_NETWORK);
  }, [url]);
};
