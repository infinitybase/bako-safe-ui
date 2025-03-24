import { Spinner, SystemStyleObject, VStack } from '@chakra-ui/react';

import { IUserInfos } from '@/modules/auth';

import { ListItem, useVirtualizeList } from '../../hooks';
import { TransactionCard } from '../TransactionCard';
import VirtualizeListTransactionItem from './components/VirtualizeListItem';
import VirtualizeListMonthItem from './components/VirtualizeListMonthItem';

interface VirtualizedGroupedListProps {
  transactions: ListItem[];
  transactionsRef: (node: HTMLDivElement) => void;
  isMobile: boolean;
  hasNextPage: boolean;
  userInfos: IUserInfos;
  defaultIndex?: number[];
  loading?: boolean;
  sx?: SystemStyleObject;
}

export const VirtualizedGroupedList = ({
  transactions,
  transactionsRef,
  hasNextPage,
  isMobile,
  userInfos,
  defaultIndex,
  loading = false,
  sx,
}: VirtualizedGroupedListProps) => {
  const { ref, virtualizer } = useVirtualizeList({
    list: transactions,
    hasNextPage,
  });

  const items = virtualizer.getVirtualItems();

  return (
    <VStack
      ref={ref}
      position="relative"
      maxH="74vh"
      minH="55vh"
      overflowY="auto"
      w="full"
      sx={{
        ...sx,
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '100%',
            transform: `translateY(${items[0]?.start ?? 0}px)`,
          }}
        >
          <TransactionCard.List w="full" spacing={0} openIndex={defaultIndex}>
            {items.map((virtualRow) => {
              const row = transactions[virtualRow.index];
              if (!row) {
                return;
              }

              if (row.type === 'group') {
                return (
                  <VirtualizeListMonthItem
                    key={virtualRow.key}
                    monthYear={row.monthYear}
                    virtualizer={virtualizer}
                  />
                );
              }

              return (
                <VirtualizeListTransactionItem
                  data-index={virtualRow.index}
                  key={virtualRow.key}
                  isMobile={isMobile}
                  transaction={row.transaction}
                  transactionsRef={transactionsRef}
                  userInfos={userInfos}
                  virtualizer={virtualizer}
                />
              );
            })}
            {loading && (
              <Spinner alignSelf={'center'} mt={4} color="brand.500" />
            )}
          </TransactionCard.List>
        </div>
      </div>
    </VStack>
  );
};
