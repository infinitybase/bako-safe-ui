import { OffChainSync } from '@bako-id/sdk';
import { Maybe } from 'yup';

import { AddressUtils } from '../address';

export const getHandleFromResolver = (
  sync: OffChainSync,
  resolver: string,
): Maybe<string> => {
  if (AddressUtils.isValid(resolver)) {
    return sync.getDomain(resolver);
  }

  return null;
};
