import { Box } from 'bako-ui';

import { AssetItem } from './asset-item';

interface Props {
  assets: {
    name: string;
    slug: string;
    amount: string;
    assetId: string;
  }[];
}

function AssetList({ assets }: Props) {
  return (
    <Box>
      {assets.map((asset) => (
        <AssetItem
          key={asset.assetId}
          name={asset.name}
          slug={asset.slug}
          amount={asset.amount}
          assetId={asset.assetId}
        />
      ))}
    </Box>
  );
}

export { AssetList };
