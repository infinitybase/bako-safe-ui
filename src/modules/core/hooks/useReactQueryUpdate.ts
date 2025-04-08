import { ITransactionReactQueryUpdate } from '@/modules/transactions/services/types';
import { useQueryClient, QueryKey } from '@tanstack/react-query';

type UpdateCallback<T> = (oldData: T, event: ITransactionReactQueryUpdate) => T;
type UpdateKeyCallback = (event?: ITransactionReactQueryUpdate) => QueryKey;

export const useReactQueryUpdate = <T>(
  queryKey: QueryKey | QueryKey[] | UpdateKeyCallback,
  updateData: UpdateCallback<T>,
) => {
  const queryClient = useQueryClient();

  return (event: ITransactionReactQueryUpdate) => {
    const keys = typeof queryKey === 'function' ? queryKey(event) : queryKey;
    const normalizedKeys = (
      Array.isArray(keys[0]) ? keys : [keys]
    ) as readonly QueryKey[];

    normalizedKeys.forEach((key) => {
      queryClient.setQueryData<T>(key, (oldData) => {
        if (!oldData) return oldData;
        return updateData(oldData, event);
      });
    });
  };
};
