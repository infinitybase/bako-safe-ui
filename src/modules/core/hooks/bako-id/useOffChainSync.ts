import { isValidDomain, OffChainSync } from '@bako-id/sdk';
import { useCallback, useEffect, useState } from 'react';

import {
  AddressUtils,
  Maybe,
  OffChainSyncInstance,
  Optional,
} from '../../utils';
import { useSyncData } from './useSyncData';

const useOffChainSync = (networkUrl: string) => {
  const [offChainSync, setOffChainSync] =
    useState<Optional<OffChainSync>>(undefined);

  useSyncData(offChainSync);

  const getHandleFromResolver = useCallback(
    (resolver: string): Maybe<string> => {
      if (AddressUtils.isValid(resolver)) {
        const domain = offChainSync?.getDomain(resolver);
        return domain ? `@${domain}` : null;
      }

      return null;
    },
    [offChainSync],
  );

  const getResolverFromHandle = useCallback(
    (handle: string): Maybe<string> => {
      if (handle.startsWith('@') && isValidDomain(handle)) {
        return offChainSync?.getResolver(handle.slice(1));
      }

      return null;
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
