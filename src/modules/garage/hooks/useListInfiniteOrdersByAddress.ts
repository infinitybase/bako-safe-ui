import { useInfiniteQuery } from '@tanstack/react-query';

import { GarageService } from '../services/garage';
import type { Order } from '../types';
import { GarageQueryKeys } from '../utils/constants';
import { PaginationResult } from '../utils/pagination';
import { Networks } from '../utils/resolver-network';
import { useChainId } from './useChainId';

type useListInfiniteOrdersByAddressProps = {
  page?: number;
  limit?: number;
  sellerAddress: string;
};

type UserOrdersResponse = PaginationResult<Order> & {
  totalOrdersUsdPrice: number;
  notListedTotalUsdPrice: number;
};

export const useListInfiniteOrdersByAddress = ({
  sellerAddress,
  page = 0,
  limit,
}: useListInfiniteOrdersByAddressProps) => {
  const { chainId } = useChainId();

  const {
    data: orders,
    isLoading: isLoadingOrders,
    ...rest
  } = useInfiniteQuery<UserOrdersResponse>({
    queryKey: [GarageQueryKeys.USER_ORDERS, sellerAddress],
    initialPageParam: page,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      if (page < totalPages) {
        return page + 1;
      }
      return undefined;
    },
    queryFn: async ({ pageParam }) => {
      const { data } = await GarageService.listUserOrders({
        page: pageParam as number,
        chainId: chainId ?? Networks.MAINNET,
        limit: limit ?? 10,
        sellerAddress,
      });

      return {
        data: data.items,
        page: data.pagination.page,
        limit: data.pagination.limit,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
        hasNextPage: data.pagination.hasNext,
        hasPreviousPage: data.pagination.hasPrev,
        totalOrdersUsdPrice: data.totalOrdersUsdPrice,
        notListedTotalUsdPrice: data.notListedTotalUsdPrice,
      };
    },
    placeholderData: (data) => data,
    enabled: chainId !== undefined && chainId !== null && !!sellerAddress,
  });

  return {
    orders,
    isLoading: !sellerAddress ? true : isLoadingOrders,
    ...rest,
  };
};
