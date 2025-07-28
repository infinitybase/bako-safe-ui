import { Asset, AssetMap, TokensUSD, useGetTokenInfos } from '@/modules';

interface OrderAssetsByUSDProps {
  assets: Asset[];
  tokensUSD: TokensUSD;
  assetsMap: AssetMap;
}

const orderAssetsByUSD = ({
  assets,
  tokensUSD,
  assetsMap,
}: OrderAssetsByUSDProps): { asset: Asset; assetAmount: number }[] => {
  if (!assets || assets.length === 0) return [];

  const assetsWithUSD = assets.map((asset) => {
    const usdData = tokensUSD[asset.assetId.toLowerCase()];
    const usdAmount = usdData?.usdAmount ?? 0;

    const { assetAmount } = useGetTokenInfos({
      ...asset,
      assetsMap,
    });

    const transactionAmount = Number(assetAmount) * (usdAmount ?? 0);

    return {
      asset,
      assetAmount: transactionAmount,
    };
  });

  return assetsWithUSD.sort((a, b) => b.assetAmount - a.assetAmount);
};

export { orderAssetsByUSD };
