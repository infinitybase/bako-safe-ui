import { useAccount, useChainId } from '@fuels/react';
import type { Order as OrderFromFuel } from '@garage/sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GarageService } from '../services/garage';
import { GarageQueryKeys } from '../utils/constants';
import { Networks } from '../utils/resolver-network';
import { useGarage } from './useGarage';

export const useCreateOrder = () => {
  const garageContract = useGarage();
  const queryClient = useQueryClient();
  const { chainId } = useChainId();
  const { account } = useAccount();

  const address = account?.toLowerCase() ?? ' ';

  const {
    mutate: createOrder,
    mutateAsync: createOrderAsync,
    ...rest
  } = useMutation({
    mutationFn: async (order: OrderFromFuel & { image: string }) => {
      const garage = await garageContract;

      const { orderId, transactionResult } = await garage.createOrder(order);

      return {
        orderId,
        image: order.image,
        assetId: order.itemAsset,
        txId: transactionResult.id,
      };
    },

    onSuccess: async (orderResult) => {
      queryClient.invalidateQueries({
        queryKey: [GarageQueryKeys.USER_ORDERS, chainId, address],
      });

      await GarageService.saveReceipt({
        txId: orderResult?.txId ?? '',
        chainId: chainId ?? Networks.MAINNET,
      });
    },
  });

  return { createOrder, createOrderAsync, ...rest };
};
