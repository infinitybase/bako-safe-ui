import { OffChainSync } from '@bako-id/sdk';
import { useEffect, useState } from 'react';

import { OffChainSyncInstance, Optional } from '../../utils';
import { useSyncData } from './useSyncData';

const useOffChainSync = (networkUrl: string) => {
  const [offChainSync, setOffChainSync] =
    useState<Optional<OffChainSync>>(undefined);

  useSyncData(offChainSync);

  useEffect(() => {
    const initOffChainSync = async () => {
      const { instance } = await OffChainSyncInstance.create(networkUrl);
      setOffChainSync(instance);
    };

    initOffChainSync();
  }, [networkUrl]);

  return offChainSync;
};

export { useOffChainSync };
