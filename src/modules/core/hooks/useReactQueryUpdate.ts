import { useQueryClient } from '@tanstack/react-query';

type UpdateCallback<T> = (oldData: T, transaction: any) => T;

export const useReactQueryUpdate = <T>(
  queryKey: any,
  updateData: UpdateCallback<T>,
) => {
  const queryClient = useQueryClient();

  return (newTransaction: any) => {
    queryClient.setQueryData(queryKey, (oldData: T | undefined) => {
      if (!oldData) return oldData;
      return updateData(oldData, newTransaction);
    });
  };
};
