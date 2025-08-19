import { ReadonlyMiraAmm } from 'mira-dex-ts';
import { useMemo } from 'react';

import { useProvider } from '../useProvider';

export const useMiraReadonly = () => {
  const provider = useProvider();

  return useMemo(() => {
    if (provider) {
      return new ReadonlyMiraAmm(
        provider,
        // '0xd5a716d967a9137222219657d7877bd8c79c64e1edb5de9f2901c98ebe74da80',
      );
    }
  }, [provider]);
};
