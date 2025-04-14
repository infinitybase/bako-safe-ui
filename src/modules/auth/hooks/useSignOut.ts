import { useMutation } from '@tanstack/react-query';

import { UserService } from '../services';

const useSignOut = () => {
  // eslint-disable-next-line react-compiler/react-compiler
  'use no memo';
  return useMutation({
    mutationKey: ['auth/sign-out'],
    mutationFn: UserService.signOut,
    retry: false,
  });
};

export { useSignOut };
