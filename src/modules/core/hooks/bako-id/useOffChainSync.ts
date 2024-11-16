import { OffChainSync } from '@bako-id/sdk';
import { useCallback, useEffect, useState } from 'react';

import { HandleUtils } from '@/utils';

import { AddressUtils, OffChainSyncInstance, Optional } from '../../utils';
import { useSyncData } from './useSyncData';

const useOffChainSync = (networkUrl: string) => {
  const [offChainSync, setOffChainSync] =
    useState<Optional<OffChainSync>>(undefined);

  useSyncData(offChainSync);

  const getHandleFromResolver = useCallback(
    (resolver: string): Optional<string> => {
      if (AddressUtils.isValid(resolver)) {
        const _resolver = resolver.toLowerCase();
        const handle = offChainSync?.getDomain(_resolver);
        return handle ? HandleUtils.toHandle(handle) : undefined;
      }

      return undefined;
    },
    [offChainSync],
  );

  const getResolverFromHandle = useCallback(
    (handle: string): Optional<string> => {
      if (HandleUtils.isValidHandle(handle)) {
        const _handle = HandleUtils.fromHandle(handle);
        return offChainSync?.getResolver(_handle);
      }

      return undefined;
    },
    [offChainSync],
  );

  useEffect(() => {
    const initOffChainSync = async () => {
      const { instance } = await OffChainSyncInstance.create(networkUrl);
      setOffChainSync(instance);
    };

    initOffChainSync();
  }, [networkUrl]);

  return {
    instance: offChainSync,
    handlers: {
      getHandleFromResolver,
      getResolverFromHandle,
    },
  };
};

export { useOffChainSync };
