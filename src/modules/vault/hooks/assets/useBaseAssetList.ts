import { useMemo } from 'react';

import { Asset, getChainId } from '@/modules/core';
import { useGetFuelsTokensListRequest } from '@/modules/workspace/hooks/useGetFuelsTokensListRequest';

export const useBaseAssetList = () => {
  const { fuelsTokens, ...rest } = useGetFuelsTokensListRequest();
  const chainId = useMemo(() => getChainId(), []);

  const assets = useMemo(
    () =>
      (fuelsTokens ?? []).reduce<Asset[]>((acc, asset) => {
        const network = asset.networks?.find(
          (network) => network.chainId === chainId && network.type === 'fuel',
        );
        if (network && 'assetId' in network) {
          if (acc.some((a) => a.assetId === network.assetId)) {
            // Avoid duplicates
            return acc;
          }
          acc.push({
            assetId: network.assetId,
            name: asset.name,
            slug: asset.symbol,
            units: network.decimals,
            icon: asset.icon,
          });
        }
        return acc;
      }, []),
    [fuelsTokens, chainId],
  );

  return { assets, ...rest };
};
