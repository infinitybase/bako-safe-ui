import { Avatar, VStack } from 'bako-ui';
import { memo, useMemo } from 'react';

import { AssetModel } from '@/modules/core';
import { parseURI } from '@/modules/core/utils/formatter';
import { useWorkspaceContext } from '@/modules/workspace/hooks';

interface TokenInfosProps {
  asset: AssetModel;
}

const TokenInfos = memo(({ asset }: TokenInfosProps) => {
  const { assetsMap } = useWorkspaceContext();
  const assetInfo = useMemo(
    () =>
      asset?.assetId && assetsMap?.[asset?.assetId]
        ? assetsMap[asset?.assetId]
        : assetsMap?.['UNKNOWN'],
    [asset?.assetId, assetsMap],
  );

  const assetImage = useMemo(
    () =>
      assetInfo?.metadata?.image ||
      assetInfo?.metadata?.['image:png'] ||
      assetInfo?.icon,
    [assetInfo],
  );

  const isNFT = useMemo(
    () => assetInfo?.isNFT || assetInfo?.units === 0,
    [assetInfo],
  );

  return (
    <VStack minW="76px" alignItems="start">
      <Avatar
        w={6}
        h={6}
        fallback={assetsMap?.UNKNOWN?.icon}
        src={parseURI(assetImage || assetsMap?.UNKNOWN?.icon || '')}
        borderRadius="md"
        shape={isNFT ? 'rounded' : 'full'}
        bg="transparent"
        objectFit="cover"
      />
    </VStack>
  );
});

TokenInfos.displayName = 'TokenInfos';

export default TokenInfos;
