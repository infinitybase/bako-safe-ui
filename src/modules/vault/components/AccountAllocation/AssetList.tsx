import { Card, Text } from 'bako-ui';
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

  const isEmpty = useMemo(() => assets.length === 0, [assets]);

  return (
    <Card.Body pt={4}>
      {isEmpty && (
        <Text color="textSecondary" textAlign="center">
          Nothing to show here yet
        </Text>
      )}
      {!isEmpty &&
        topThreeAssets.map((asset) => (
          <AssetItem key={asset.assetId} asset={asset} />
        ))}
    </Card.Body>
  );
};
