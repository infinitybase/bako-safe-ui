import { useMemo } from 'react';

import { useWorkspaceContext } from '@/modules/workspace';

export const useGetUSDValue = (assetId: string) => {
  const { tokensUSD } = useWorkspaceContext();

  return useMemo(() => {
    if (!tokensUSD.data) return null;
    return tokensUSD.data[assetId]?.usdAmount || null;
  }, [tokensUSD, assetId]);
};
