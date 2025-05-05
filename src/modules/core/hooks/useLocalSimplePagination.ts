import { useCallback, useEffect, useState } from 'react';

export function useLocalSimplePagination<T>(items: T[], chunkSize = 20) {
  const [visibleCount, setVisibleCount] = useState(chunkSize);

  useEffect(() => {
    setVisibleCount(chunkSize);
  }, [items, chunkSize]);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + chunkSize);
  }, [chunkSize]);

  const hasMore = visibleCount < items.length;
  const visibleData = items.slice(0, visibleCount);

  const reset = useCallback(() => {
    setVisibleCount(chunkSize);
  }, [chunkSize]);

  return { visibleData, loadMore, hasMore, reset };
}
