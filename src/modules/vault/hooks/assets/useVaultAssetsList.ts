import { MutableRefObject, useEffect, useState } from 'react';

import { Asset, NFT } from '@/modules/core/utils';

function useVaultAssetsList(
  containerRef: MutableRefObject<HTMLDivElement | null>,
  assets: Asset[],
  nfts?: NFT[],
) {
  const [visibleItems, setVisibleItems] = useState(1);
  const [showViewAll, setShowViewAll] = useState(false);
  const [countViewAll, setCountViewAll] = useState(0);

  const itemWidth = 200;

  useEffect(() => {
    const updateVisibleItems = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;

        if (assets.length > 0) {
          let itemsToShow = Math.floor(containerWidth / itemWidth);

          if (itemsToShow < 1) {
            itemsToShow = 1;
          }

          const assetCounter = assets.length;
          const nftCounter = nfts?.length ?? 0;

          setVisibleItems(itemsToShow);
          setShowViewAll(assetCounter + nftCounter > itemsToShow);
          setCountViewAll(assetCounter + nftCounter - itemsToShow);
        }
      }
    };

    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);

    return () => window.removeEventListener('resize', updateVisibleItems);
  }, [assets, containerRef]);

  return {
    visibleItems,
    showViewAll,
    countViewAll,
    itemWidth,
  };
}

export { useVaultAssetsList };
