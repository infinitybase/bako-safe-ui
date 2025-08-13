import { Image, Text, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';

import { AssetModel } from '@/modules/core';
import { parseURI } from '@/modules/core/utils/formatter';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface TokenInfosProps {
  asset: AssetModel;
}

const TokenInfos = ({ asset }: TokenInfosProps) => {
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

  return (
    <VStack minW="76px" alignItems="start">
      <Image
        w={7}
        h={7}
        fallbackStrategy="onError"
        fallbackSrc={assetsMap?.UNKNOWN?.icon}
        src={parseURI(assetImage || assetsMap?.UNKNOWN?.icon || '')}
        borderRadius="md"
        alt="Asset Icon"
        objectFit="cover"
      />
      <Text fontSize="sm" color="grey.500">
        {assetInfo?.slug}
      </Text>
    </VStack>
  );
};
export default TokenInfos;
