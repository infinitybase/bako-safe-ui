import { queryClient } from '@/config';

export const invalidateQueries = (keys?: string[]) => {
  if (!keys) {
    return queryClient.invalidateQueries();
  }

  return queryClient.invalidateQueries({
    predicate: (query) => {
      const { queryKey } = query;

      if (Array.isArray(queryKey)) {
        return keys.includes(queryKey[0]);
      }

      return false;
    },
  });
};
