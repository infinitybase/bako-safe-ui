import { Vault } from 'bakosafe';
import { useMemo } from 'react';

import BakoAMM from '@/modules/core/utils/bako-amm';

export const useBakoAmm = (vault?: Vault) => {
  return useMemo(() => {
    if (vault) {
      return new BakoAMM(vault);
    }
  }, [vault]);
};
