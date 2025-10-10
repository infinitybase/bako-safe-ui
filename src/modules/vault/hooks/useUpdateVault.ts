import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useContactToast } from '@/modules/addressBook';
import { HomeQueryKey, PredicateUpdatePayload } from '@/modules/core';

import { VaultService } from '../services';
import { VAULT_TRANSACTIONS_LIST_PAGINATION } from './list/useVaultTransactionsRequest';

export const useUpdateVault = (workspaceId: string) => {
  const queryClient = useQueryClient();
  const { successToast, errorToast } = useContactToast();

  const { mutateAsync: updateVault, ...rest } = useMutation({
    mutationKey: ['update-vault'],
    mutationFn: async ({
      id,
      ...data
    }: PredicateUpdatePayload & { id: string }) =>
      VaultService.updatePredicate(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['vault/by-id', data.id],
      });
      queryClient.invalidateQueries({
        queryKey: HomeQueryKey.HOME_DATA(workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: [VAULT_TRANSACTIONS_LIST_PAGINATION],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: HomeQueryKey.HOME_WORKSPACE(workspaceId),
      });
      successToast({ title: 'Vault updated successfully' });
    },
    onError: () => {
      errorToast({ title: 'Failed to update vault' });
    },
  });

  return { updateVault, ...rest };
};
