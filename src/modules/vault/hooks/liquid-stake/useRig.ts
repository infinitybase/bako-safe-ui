import { Vault } from 'bakosafe';
import { useMemo } from 'react';

import { Rig } from '@/contracts/rig/mainnet/types';

const RIG_ID_CONTRACT = import.meta.env.VITE_RIG_ID_CONTRACT!;

export const useRig = (vault?: Vault) => {
  return useMemo(() => {
    if (vault) {
      return new Rig(RIG_ID_CONTRACT, vault);
    }
  }, [vault]);
};
