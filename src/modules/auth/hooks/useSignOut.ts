import { useMutation } from '@tanstack/react-query';

import { UserService } from '../services';

const useSignOut = () => {
  return useMutation({
    mutationKey: ['auth/sign-out'],
    mutationFn: UserService.signOut,
    retry: false,
  });
};

export { useSignOut };
