import { ReadonlyMiraAmm } from 'mira-dex-ts';
import { useMemo } from 'react';

import { getChainId } from '@/modules/core';
import {
  DEFAULT_AMM_CONTRACT_ID,
  TESTNET_AMM_CONTRACT_ID,
} from '@/modules/core/utils/bako-amm';

import { useProvider } from '../useProvider';

export const useMiraReadonly = (networkUrl: string) => {
  const provider = useProvider(networkUrl);

  return useMemo(() => {
    if (provider) {
      const chainId = getChainId();
      return new ReadonlyMiraAmm(
        provider,
        chainId === 0 ? TESTNET_AMM_CONTRACT_ID : DEFAULT_AMM_CONTRACT_ID,
      );
    }
  }, [provider]);
};
