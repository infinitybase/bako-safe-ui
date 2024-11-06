import { OffChainSync } from '@bako-id/sdk';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { OffChainSyncInstance } from '../../utils/offChainSync';

const OFF_CHAIN_SYNC_DATA_QUERY_KEY = 'off-chain-sync-data';

const useOffChainSync = (networkUrl: string) => {
  const [offChainSync, setOffChainSync] = useState<OffChainSync | undefined>(
    undefined,
  );

  useQuery({
    queryKey: [OFF_CHAIN_SYNC_DATA_QUERY_KEY],
    queryFn: async () => {
      await offChainSync?.syncData();
      return null;
    },
    refetchInterval: 10 * 60 * 1000, // 10m
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 500, // 500ms second to prevent request spam
  });

  useEffect(() => {
    const initOffChainSync = async () => {
      const { instance } = await OffChainSyncInstance.create(networkUrl);
      setOffChainSync(instance);
    };

    initOffChainSync();
  }, [networkUrl]);

  return offChainSync;
};

export { OFF_CHAIN_SYNC_DATA_QUERY_KEY, useOffChainSync };
