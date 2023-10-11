import { queryClient } from '@/config';

export const invalidateQueries = (keys: string[]) => {
  queryClient.invalidateQueries({
    predicate: (query) => {
      const { queryKey } = query;

      if (Array.isArray(queryKey)) {
        return keys.includes(queryKey[0]);
      }

      return false;
    },
  });
};
