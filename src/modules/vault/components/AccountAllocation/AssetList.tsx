import { Card } from 'bako-ui';
import { useMemo } from 'react';

import { useWorkspaceContext } from '@/modules';
import { Asset } from '@/modules/core';

import AssetItem from './AssetItem';

export const AssetsList = ({ assets }: { assets: Asset[] }) => {
  const { tokensUSD } = useWorkspaceContext();

  const topThreeAssets = useMemo(() => {
    if (assets.length <= 1) return assets;

    return assets
      .map((asset) => ({
        asset,
        usdAmount: tokensUSD.data[asset.assetId.toLowerCase()]?.usdAmount ?? 0,
      }))
      .sort((a, b) => b.usdAmount - a.usdAmount)
      .slice(0, 3)
      .map((item) => item.asset);
  }, [assets, tokensUSD]);

  return (
    <Card.Body pt={4}>
      {topThreeAssets.map((asset) => (
        <AssetItem key={asset.assetId} asset={asset} />
      ))}
    </Card.Body>
  );
};
