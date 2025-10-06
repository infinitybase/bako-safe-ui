import { useMutation } from '@tanstack/react-query';

import { PredicateUpdatePayload } from '@/modules/core';

import { VaultService } from '../services';

export const useUpdateVault = () => {
  const { mutateAsync: updateVault, ...rest } = useMutation({
    mutationKey: ['update-vault'],
    mutationFn: async ({
      id,
      ...data
    }: PredicateUpdatePayload & { id: string }) =>
      VaultService.updatePredicate(id, data),
  });

  return { updateVault, ...rest };
};
