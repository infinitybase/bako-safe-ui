import { queryClient } from '@/config';
import { FuelQueryKeys } from '@/modules/core/hooks/fuel/types';

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

/**
 * Query keys that contain immutable data and should NOT be invalidated on network switch.
 * These are cached with staleTime: Infinity and persist across network changes.
 */
const IMMUTABLE_QUERY_KEYS = [
  // Asset metadata - immutable on blockchain
  'assetMetadata',
  'assetsMetadata',
  // Bako ID - rarely changes, manually invalidated when needed
  'bako-id',
  // Meld service data - immutable lists
  'meld/crypto-currencies',
  'meld/fiat-currencies',
  'meld/providers',
  'meld/payment-methods',
  // Network list - immutable
  'network/list',
  // Cached images - immutable
  'cachedImage',
  // GIF loading animation - UI only
  'gif-animation-loading',
  // User settings - not network dependent
  'my-settings',
  // Notifications - not network dependent
  'notifications',
];

/**
 * Smart invalidation for network switch.
 * Preserves immutable data (assets, Bako ID, Meld lists) while invalidating
 * network-dependent queries (balances, transactions, vaults, etc.).
 *
 * This prevents the "avalanche effect" of clearing all queries at once,
 * which would cause excessive API calls and slow down the UI.
 */
export const invalidateQueriesOnNetworkSwitch = () => {
  // Invalidate provider first - this is the most critical
  queryClient.invalidateQueries({ queryKey: [FuelQueryKeys.PROVIDER] });
  queryClient.invalidateQueries({ queryKey: [FuelQueryKeys.WALLET] });
  queryClient.invalidateQueries({ queryKey: [FuelQueryKeys.CURRENT_ACCOUNT] });

  // Invalidate all queries EXCEPT immutable ones
  return queryClient.invalidateQueries({
    predicate: (query) => {
      const { queryKey } = query;

      if (Array.isArray(queryKey)) {
        const firstKey = queryKey[0];

        // Skip immutable queries
        if (typeof firstKey === 'string') {
          return !IMMUTABLE_QUERY_KEYS.some(
            (immutableKey) =>
              firstKey === immutableKey || firstKey.startsWith(immutableKey),
          );
        }
      }

      // Invalidate non-array query keys
      return true;
    },
  });
};
