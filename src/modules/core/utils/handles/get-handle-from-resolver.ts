import { OffChainSync } from '@bako-id/sdk';
import { Maybe } from 'yup';

import { AddressUtils } from '../address';

export const getHandleFromResolver = (
  resolver: string,
  sync?: OffChainSync,
): Maybe<string> => {
  if (AddressUtils.isValid(resolver)) {
    const domain = sync?.getDomain(resolver);
    return domain ? `@${domain}` : null;
  }

  return null;
};
