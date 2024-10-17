import { Text, VStack } from '@chakra-ui/react';
import { Fragment, MutableRefObject } from 'react';
import { To, useNavigate } from 'react-router-dom';

import { AssetCard } from '@/modules/core/components';
import { Asset, NFT } from '@/modules/core/utils';

import { useVaultAssetsList } from '../hooks';

interface AssetsDetailsProps {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  assets: Asset[];
  nfts?: NFT[];
  visibleBalance?: boolean;
  viewAllRedirect: To;
}

const AssetsDetails = ({
  containerRef,
  assets,
  nfts,
  visibleBalance,
  viewAllRedirect,
}: AssetsDetailsProps) => {
  const navigate = useNavigate();
  const { visibleItems, showViewAll, countViewAll, itemWidth } =
    useVaultAssetsList(containerRef, assets, nfts);

  return (
    <>
      {assets.map((asset, index) => (
        <Fragment key={`${asset.assetId}-${index}`}>
          {index < visibleItems && (
            <AssetCard
              flex={2}
              maxW={itemWidth}
              asset={asset}
              visibleBalance={visibleBalance}
            />
          )}
        </Fragment>
      ))}

      {nfts?.map((nft, index) => (
        <Fragment key={`${nft.assetId}-${index}`}>
          {assets.length + index < visibleItems && (
            <AssetCard
              flex={2}
              maxW={itemWidth}
              asset={nft as Asset}
              visibleBalance={visibleBalance}
              isNFT={true}
            />
          )}
        </Fragment>
      ))}

      {showViewAll && (
        <VStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          alignSelf="stretch"
          maxW={itemWidth}
          minW={92}
          minH="101px"
          p={4}
          borderRadius={10}
          bgColor="grey.950"
          spacing={0}
          cursor="pointer"
          onClick={() => navigate(viewAllRedirect)}
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
