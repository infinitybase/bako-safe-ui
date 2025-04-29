import { useCallback, useEffect, useMemo, useState } from 'react';

type GroupedItems<T> = Record<string, T[]>;
type Input<T> = T[] | GroupedItems<T>;

export function useLocalGroupedPagination<T>(
  input: T[] | Record<string, T[]>,
  priorityOrder?: string[],
  chunkSize = 20,
) {
  const [visibleCount, setVisibleCount] = useState(chunkSize);

  // Uniformiza a entrada para um objeto agrupado
  const grouped = useMemo<GroupedItems<T>>(() => {
    if (Array.isArray(input)) {
      return { default: input };
    }
    return input;
  }, [input]);

  // Define a ordem de prioridade
  const priorities = useMemo(() => {
    return priorityOrder ?? Object.keys(grouped);
  }, [grouped, priorityOrder]);

  // Flatten dos itens com grupo
  const flatList = useMemo(() => {
    const result: { group: string; item: T }[] = [];
    for (const group of priorities) {
      const groupItems = grouped[group] ?? [];
      for (const item of groupItems) {
        result.push({ group, item });
      }
    }
    return result;
  }, [grouped, priorities]);

  const visibleFlat = flatList.slice(0, visibleCount);

  const visibleData = useMemo(() => {
    return visibleFlat.reduce<GroupedItems<T>>((acc, { group, item }) => {
      (acc[group] ??= []).push(item);
      return acc;
    }, {});
  }, [visibleFlat]);

  const flatVisibleItem = useMemo(
    () => visibleFlat.map(({ item }) => item),
    [visibleFlat],
  );

  const hasMore = visibleCount < flatList.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + chunkSize);
  }, [chunkSize]);

  const reset = useCallback(() => {
    setVisibleCount(chunkSize);
  }, [chunkSize]);

  useEffect(() => {
    reset();
  }, [input, chunkSize, JSON.stringify(priorityOrder), reset]);

  return {
    visibleData,
    flatVisibleItem,
    loadMore,
    hasMore,
    reset,
    visibleCount,
  };
}
