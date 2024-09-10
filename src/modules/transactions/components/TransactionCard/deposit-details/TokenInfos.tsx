import { HStack, Icon, Text } from '@chakra-ui/react';
import { useMemo } from 'react';

import { UnknownIcon } from '@/components';
import { AssetModel, assetsMap } from '@/modules/core';

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
      <Icon
        w={{ base: 6, sm: 6 }}
        h={{ base: 6, sm: 6 }}
        as={assetInfo?.icon ?? UnknownIcon}
      />
      <Text fontSize="sm" color="grey.500">
        {assetInfo?.slug}
      </Text>
    </HStack>
  );
};
export default TokenInfos;
