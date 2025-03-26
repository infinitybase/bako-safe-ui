import { ITransactionReactQueryUpdate } from '@/modules/transactions/services/types';
import { useQueryClient, QueryKey } from '@tanstack/react-query';

type UpdateCallback<T> = (oldData: T, event: ITransactionReactQueryUpdate) => T;
type UpdateKeyCallback = (event?: ITransactionReactQueryUpdate) => QueryKey;

export const useReactQueryUpdate = <T>(
  queryKey: QueryKey | UpdateKeyCallback,
  updateData: UpdateCallback<T>,
) => {
  const queryClient = useQueryClient();

  return (event: ITransactionReactQueryUpdate) => {
    const key = typeof queryKey === 'function' ? queryKey(event) : queryKey;
    queryClient.setQueryData(key, (oldData: T | undefined) => {
      if (!oldData) return oldData;
      return updateData(oldData, event);
    });
  };
};
