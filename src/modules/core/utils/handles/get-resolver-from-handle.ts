import { isValidDomain, OffChainSync } from '@bako-id/sdk';

import { Maybe } from '../types';

export const getResolverFromHandle = (
  handle: string,
  sync?: OffChainSync,
): Maybe<string> => {
  if (handle.startsWith('@') && isValidDomain(handle)) {
    return sync?.getResolver(handle.slice(1));
  }

  return null;
};
