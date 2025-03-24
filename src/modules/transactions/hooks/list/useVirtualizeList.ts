import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

import { ListItem } from './useTransactionList';

export const useVirtualizeList = ({
  list,
  hasNextPage,
}: {
  list: ListItem[];
  hasNextPage: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: hasNextPage ? list.length + 1 : list.length,
    getScrollElement: () => ref.current,
    estimateSize: () => 85,
    overscan: 2,
  });

  return { virtualizer, ref };
};
