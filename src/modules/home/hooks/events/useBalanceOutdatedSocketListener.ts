import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { HomeQueryKey, SocketEvents } from '@/modules/core';
import { useSocketEvent } from '@/modules/core/hooks/socket/useSocketEvent';
import { USER_ALLOCATION_QUERY_KEY } from '@/modules/home/hooks';
import { vaultAssetsQueryKey } from '@/modules/vault/hooks/assets/useVaultAssets';

export interface BalanceOutdatedUserEvent {
  sessionId: string;
  to: string;
  type: SocketEvents;
  workspaceId: string;
  outdatedPredicateIds: string[];
}

/**
 * Hook to listen for balance outdated events via socket
 * Updates queries of:
 * - Home transactions
 * - User allocation
 * - Vault assets balance for each affected predicate
 */
export const useBalanceOutdatedSocketListener = () => {
  const queryClient = useQueryClient();

  const handleBalanceOutdated = useCallback(
    (event: BalanceOutdatedUserEvent) => {
      const { outdatedPredicateIds, workspaceId } = event;

      // Affects: Home page transaction list
      queryClient.invalidateQueries({
        queryKey: HomeQueryKey.HOME_WORKSPACE(workspaceId),
      });

      // Affects: Balance allocation card in home page
      queryClient.invalidateQueries({
        queryKey: [USER_ALLOCATION_QUERY_KEY],
      });

      // Affects: Vault balance, sidebar, recent vaults in home
      outdatedPredicateIds.forEach((predicateId) => {
        queryClient.invalidateQueries({
          queryKey: vaultAssetsQueryKey.VAULT_ASSETS_QUERY_KEY(
            workspaceId,
            predicateId,
          ),
        });
      });
    },
    [queryClient],
  );

  useSocketEvent<BalanceOutdatedUserEvent>(SocketEvents.BALANCE_OUTDATED_USER, [
    handleBalanceOutdated,
  ]);
};
