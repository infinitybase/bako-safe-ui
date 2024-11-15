import { OffChainSync } from '@bako-id/sdk';
import { useQuery } from '@tanstack/react-query';

export const OFF_CHAIN_SYNC_DATA_QUERY_KEY = 'off-chain-sync-data';

const useSyncData = (sync?: OffChainSync) => {
  return useQuery({
    queryKey: [OFF_CHAIN_SYNC_DATA_QUERY_KEY],
    queryFn: async () => {
      await sync?.syncData();
      return null;
    },
    refetchInterval: 10 * 60 * 1000, // 10m
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });
};

export { useSyncData };
