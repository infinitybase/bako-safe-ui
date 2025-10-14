import { Text, VStack } from 'bako-ui';
import { Fragment, MutableRefObject, useMemo } from 'react';
import { To, useNavigate } from 'react-router-dom';

import { useOrderAssetsByUSD } from '@/modules/core';
import { AssetCard } from '@/modules/core/components';
import { Asset, NFT } from '@/modules/core/utils';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

import { useVaultAssetsList } from '../hooks';

export interface TokensUSD {
  [assetId: string]: {
    usdAmount: number;
  };
}

interface AssetsDetailsProps {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  assets: Asset[];
  nfts?: NFT[];
  visibleBalance?: boolean;
  viewAllRedirect: To;
  tokensUSD: TokensUSD;
}

const AssetsDetails = ({
  containerRef,
  assets,
  nfts,
  visibleBalance,
  viewAllRedirect,
  tokensUSD,
}: AssetsDetailsProps) => {
  const navigate = useNavigate();
  const { visibleItems, showViewAll, countViewAll, itemWidth } =
    useVaultAssetsList(containerRef, assets, nfts);

  const { assetsMap } = useWorkspaceContext();

  const stableAssets = useMemo(() => assets, [assets]);
  const stableTokensUSD = useMemo(() => tokensUSD, [tokensUSD]);
  const stableAssetsMap = useMemo(() => assetsMap, [assetsMap]);

  const assetsOrdered = useOrderAssetsByUSD({
    assets: stableAssets,
    tokensUSD: stableTokensUSD,
    assetsMap: stableAssetsMap,
  });

  return (
    <>
      {assetsOrdered.map((assetOrdered, index) => {
        const asset = assetOrdered.asset;
        const usdData = tokensUSD[asset.assetId.toLowerCase()];
        const usdAmount = usdData?.usdAmount ?? null;

        return (
          <Fragment key={`${asset.assetId}-${index}`}>
            {index < visibleItems && (
              <AssetCard
                flex={2}
                maxW={itemWidth}
                asset={asset}
                visibleBalance={visibleBalance}
                usdAmount={usdAmount}
              />
            )}
          </Fragment>
        );
      })}

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
          p={4}
          borderRadius={10}
          bgColor="grey.950"
          gap={0}
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
