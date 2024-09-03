import { useCallback } from 'react';

import { Pages } from '@/modules/core/routes';

import { ISignInRedirect } from './types';

export type UseWebSignIn = ReturnType<typeof useWebSignIn>;

const useWebSignIn = (): ISignInRedirect => {
  const redirect = useCallback(() => {
    return Pages.home();
  }, []);

  return {
    redirect,
  };
};

export { useWebSignIn };
