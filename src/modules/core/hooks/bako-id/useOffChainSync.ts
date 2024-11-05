import { OffChainSync } from '@bako-id/sdk';
import { useEffect, useState } from 'react';

import { OffChainSyncInstance } from '../../utils/offChainSync';

const useOffChainSync = (networkUrl: string) => {
  const [offChainSync, setOffChainSync] = useState<OffChainSync | null>(null);

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
