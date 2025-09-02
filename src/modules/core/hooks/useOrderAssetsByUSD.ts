import { bn } from 'fuels';
import { useMemo } from 'react';

import { Asset, AssetMap, TokensUSD } from '@/modules';
import { isHex } from '@/utils';

interface OrderAssetsByUSDProps {
  assets: Asset[];
  tokensUSD: TokensUSD;
  assetsMap: AssetMap;
}

const useOrderAssetsByUSD = ({
  assets,
  tokensUSD,
  assetsMap,
}: OrderAssetsByUSDProps) => {
  return useMemo(() => {
    if (!assets || assets.length === 0) return [];

    const assetsWithUSD = assets.map((asset) => {
      const usdData = tokensUSD[asset.assetId.toLowerCase()];
      const usdAmount = usdData?.usdAmount ?? 0;

      const assetsInfo = assetsMap?.[asset.assetId] ?? assetsMap?.['UNKNOWN'];
      const assetAmount = isHex(asset.amount ?? '')
        ? bn(asset.amount)?.format({
            units: assetsInfo?.units ?? assetsMap.UNKNOWN.units,
          })
        : asset.amount;

      return {
        asset,
        assetAmount: Number(assetAmount?.replace(/,/g, '')) * usdAmount,
      };
    });

    return [...assetsWithUSD].sort((a, b) => b.assetAmount - a.assetAmount);
  }, [assets, tokensUSD, assetsMap]);
};

export { useOrderAssetsByUSD };
