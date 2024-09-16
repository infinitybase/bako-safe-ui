import { Icon, Text, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';

import { UnknownIcon } from '@/components';
import { AssetModel, assetsMap } from '@/modules/core';

interface TokenInfosProps {
  asset: AssetModel;
}

const TokenInfos = ({ asset }: TokenInfosProps) => {
  const assetInfo = useMemo(
    () =>
      asset?.assetId && assetsMap[asset?.assetId]
        ? assetsMap[asset?.assetId]
        : assetsMap['UNKNOWN'],
    [asset?.assetId],
  );
  return (
    <VStack spacing={2} minW="76px" alignItems="start">
      <Icon
        w={{ base: 6, sm: 6 }}
        h={{ base: 6, sm: 6 }}
        as={assetInfo?.icon ?? UnknownIcon}
      />
      <Text fontSize="sm" color="grey.500">
        {assetInfo?.slug}
      </Text>
    </VStack>
  );
};
export default TokenInfos;
