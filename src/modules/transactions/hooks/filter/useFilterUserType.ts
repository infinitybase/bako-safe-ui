import { useQuery } from '@tanstack/react-query';

import { UserService } from '@/modules/auth';

const useGetUserById = (userId?: string) => {
  const fetchUserById = async () => {
    if (!userId) throw new Error('User ID is required');
    return UserService.getById(userId);
  };

  return useQuery({
    queryKey: ['user', userId],
    queryFn: fetchUserById,
    enabled: !!userId,
  });
};

export { useGetUserById };
