import { useMutation } from '@tanstack/react-query';

import { userService } from '@/config/services-initializer';

const useSignOut = () => {
  return useMutation({
    mutationKey: ['auth/sign-out'],
    mutationFn: userService.signOut,
    retry: false,
  });
};

export { useSignOut };
