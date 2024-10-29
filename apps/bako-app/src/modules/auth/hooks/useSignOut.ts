import { UserService } from '@bako-safe/services/modules/auth';
import { useMutation } from '@tanstack/react-query';

const useSignOut = () => {
  return useMutation({
    mutationKey: ['auth/sign-out'],
    mutationFn: UserService.signOut,
    retry: false,
  });
};

export { useSignOut };
