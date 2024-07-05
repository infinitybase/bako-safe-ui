import { AssetModel, assetsMap } from '@/modules/core';
import { Avatar, HStack, Text } from '@chakra-ui/react';
import { useMemo } from 'react';

interface TokenInfosProps {
  asset: AssetModel;
}

const TokenInfos = ({ asset }: TokenInfosProps) => {
  const assetInfo = useMemo(
    () => (asset?.assetId ? assetsMap[asset?.assetId] : null),
    [asset?.assetId],
  );
  return (
    <HStack spacing={{ base: 2, sm: 3 }} minW="76px">
      <Avatar
        name={assetInfo?.slug}
        size="xs"
        src={assetInfo?.icon}
        ignoreFallback
      />
      <Text fontSize="sm" color="grey.500">
        {assetInfo?.slug}
      </Text>
    </HStack>
  );
};
export default TokenInfos;
