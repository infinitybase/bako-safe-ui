import { Text, VStack } from '@chakra-ui/react';
import { MutableRefObject } from 'react';

import { AssetCard } from '@/modules/core/components';
import { Asset } from '@/modules/core/utils';

import { useVaultAssetsList } from '../hooks';

interface AssetsDetailsProps {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  assets: Asset[];
  visibleBalance?: boolean;
}

const AssetsDetails = ({
  containerRef,
  assets,
  visibleBalance,
}: AssetsDetailsProps) => {
  const { visibleItems, showViewAll, countViewAll, itemWidth } =
    useVaultAssetsList(containerRef, assets);

  return (
    <>
      {assets.map((asset, index) => (
        <>
          {index < visibleItems && (
            <AssetCard
              key={`${asset.assetId}-${index}`}
              flex={2}
              maxW={itemWidth}
              asset={asset}
              visibleBalance={visibleBalance}
            />
          )}
        </>
      ))}

      {showViewAll && (
        <VStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          alignSelf="stretch"
          maxW={itemWidth}
          p={4}
          borderRadius={10}
          bgColor="grey.950"
          spacing={0}
          cursor="pointer"
        >
          <Text
            fontSize={{ base: 'lg', sm: 'xl' }}
            fontWeight="bold"
            textAlign="center"
          >
            +{countViewAll}
          </Text>
          <Text fontSize={{ base: 'sm', sm: 'md' }} textAlign="center">
            View all
          </Text>
        </VStack>
      )}
    </>
  );
};

export { AssetsDetails };
