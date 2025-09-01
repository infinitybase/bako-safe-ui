import { useAccount } from '@fuels/react';
import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { GarageService } from '../services/garage';
import { Order } from '../types';
import { GarageQueryKeys } from '../utils/constants';
import { PaginationResult } from '../utils/pagination';
import { Networks } from '../utils/resolver-network';
import { useChainId } from './useChainId';
import { useGarage } from './useGarage';

export const useCancelOrder = () => {
  const marketplaceContract = useGarage();
  const queryClient = useQueryClient();
  const { account } = useAccount();
  const { chainId } = useChainId();
  const address = account?.toLowerCase() ?? '';

  const {
    mutate: cancelOrder,
    mutateAsync: cancelOrderAsync,
    ...rest
  } = useMutation({
    mutationFn: async (orderId: string) => {
      const marketplace = await marketplaceContract;
      const { transactionResult } = await marketplace.cancelOrder(orderId);
      return { orderId, txId: transactionResult.id };
    },

    onSuccess: async ({ orderId, txId }) => {
      await queryClient.invalidateQueries({
        queryKey: [GarageQueryKeys.USER_ORDERS, address],
      });

      await GarageService.saveReceipt({
        txId,
        chainId: chainId ?? Networks.MAINNET,
      });

      queryClient.setQueryData(
        [GarageQueryKeys.USER_ORDERS, address],
        (old: InfiniteData<PaginationResult<Order>, unknown>) => {
          return {
            ...old,
            pages: old.pages.map((page) => {
              const result = {
                ...page,
                data: page.data.filter((item) => item.id !== orderId),
              };
              return result;
            }),
          };
        },
      );
    },
  });

  return { cancelOrder, cancelOrderAsync, ...rest };
};
