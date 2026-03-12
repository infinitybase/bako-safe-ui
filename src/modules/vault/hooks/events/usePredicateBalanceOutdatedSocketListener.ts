import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { HomeQueryKey, SocketEvents } from '@/modules/core';
import { useSocketEvent } from '@/modules/core/hooks/socket/useSocketEvent';
import { USER_ALLOCATION_QUERY_KEY } from '@/modules/home';

import { vaultAssetsQueryKey } from '../assets/useVaultAssets';
import { vaultInfinityQueryKey } from '../list/useVaultTransactionsRequest';
import { vaultAllocationQueryKey } from '../useVaultBalanceAllocationRequest';

export interface PredicateBalanceOutdatedEvent {
  sessionId: string;
  to: string;
  type: SocketEvents;
  predicateId: string;
  workspaceId: string;
}

/**
 * Hook to listen for predicate balance outdated events via socket
 * Updates queries of:
 * - Home transactions
 * - User allocation
 * - Vault assets balance
 * - Vault transactions
 * - Vault balance allocation
 */
export const usePredicateBalanceOutdatedSocketListener = () => {
  const queryClient = useQueryClient();

  const handlePredicateBalanceOutdated = useCallback(
    (event: PredicateBalanceOutdatedEvent) => {
      const { predicateId, workspaceId } = event;

      // Affects: Home page transaction list
      queryClient.invalidateQueries({
        queryKey: HomeQueryKey.HOME_WORKSPACE(workspaceId),
      });

      // Affects: Balance allocation card in home page
      queryClient.invalidateQueries({
        queryKey: [USER_ALLOCATION_QUERY_KEY],
      });

      // Affects: Vault balance page, reserved coins status
      queryClient.invalidateQueries({
        queryKey: vaultAssetsQueryKey.VAULT_ASSETS_QUERY_KEY(
          workspaceId,
          predicateId,
        ),
      });

      // Affects: Vault transaction list with incoming/outgoing transactions
      queryClient.invalidateQueries({
        queryKey:
          vaultInfinityQueryKey.VAULT_TRANSACTION_LIST_PAGINATION_QUERY_KEY(
            predicateId,
          ),
      });

      // Affects: Vault balance allocation card
      queryClient.invalidateQueries({
        queryKey:
          vaultAllocationQueryKey.VAULT_ALLOCATION_QUERY_KEY(predicateId),
      });
    },
    [queryClient],
  );

  useSocketEvent<PredicateBalanceOutdatedEvent>(
    SocketEvents.BALANCE_OUTDATED_PREDICATE,
    [handlePredicateBalanceOutdated],
  );
};
