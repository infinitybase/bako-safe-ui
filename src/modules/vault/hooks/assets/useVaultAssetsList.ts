import { MutableRefObject, useEffect, useState } from 'react';

import { Asset } from '@/modules/core/utils';

function useVaultAssetsList(
  containerRef: MutableRefObject<HTMLDivElement | null>,
  assets: Asset[],
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
          let itemsToShow = Math.floor(containerWidth / itemWidth) - 1;

          if (itemsToShow < 1) {
            itemsToShow = 1;
          }

          setVisibleItems(itemsToShow);
          setShowViewAll(assets.length > itemsToShow);
          setCountViewAll(assets.length - itemsToShow);
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
