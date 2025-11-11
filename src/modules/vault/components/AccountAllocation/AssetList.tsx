import { Card, Text } from 'bako-ui';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

import { useWorkspaceContext } from '@/modules';
import { Asset } from '@/modules/core';

import AssetItem from './AssetItem';

const MotionBody = motion(Card.Body);

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
    <MotionBody
      pt={4}
      justifyContent={isEmpty ? 'center' : 'flex-start'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isEmpty && (
        <Text color="textSecondary" textAlign="center">
          Nothing to show here yet
        </Text>
      )}
      {!isEmpty &&
        topThreeAssets.map((asset) => (
          <AssetItem key={asset.assetId} asset={asset} />
        ))}
    </MotionBody>
  );
};
