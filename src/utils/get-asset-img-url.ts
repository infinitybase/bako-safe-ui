import { Asset, AssetMap } from '@/modules/core';
import { parseURI } from '@/modules/core/utils/formatter';

function getAssetImageUrl(data: Asset, map: AssetMap): string | undefined {
  const image =
    data?.metadata?.image || data?.metadata?.['image:png'] || data?.icon;

  return image ? parseURI(image) : map?.['UNKNOWN']?.icon;
}

export { getAssetImageUrl };
