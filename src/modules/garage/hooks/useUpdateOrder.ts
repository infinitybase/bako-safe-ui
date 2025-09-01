import { useAccount } from '@fuels/react';
import type { UpdateOrder } from '@garage/sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GarageService } from '../services/garage';
import { GarageQueryKeys } from '../utils/constants';
import { Networks } from '../utils/resolver-network';
import { useChainId } from './useChainId';
import { useGarage } from './useGarage';

type TUpdateOrder = UpdateOrder & {
  orderId: string;
  oldPrice: { oldAmount: number; oldRaw: string };
  newPrice: { newAmount: number; newRaw: string; usd: number };
  assetIcon: string;
};

export const useUpdateOrder = () => {
  const garageContract = useGarage();
  const queryClient = useQueryClient();
  const { account } = useAccount();
  const { chainId } = useChainId();

  const address = account?.toLowerCase();

  const {
    mutate: updateOrder,
    mutateAsync: updateOrderAsync,
    ...rest
  } = useMutation({
    mutationFn: async ({
      orderId,
      oldPrice,
      newPrice,
      assetIcon,
      ...data
    }: TUpdateOrder) => {
      const marketplace = await garageContract;
      const { transactionResult } = await marketplace.updateOrder(
        orderId,
        data,
      );
      return {
        orderId,
        oldPrice,
        newPrice,
        data,
        txId: transactionResult.id,
        assetIcon,
      };
    },
    onSuccess: async ({ txId }) => {
      queryClient.invalidateQueries({
        queryKey: [GarageQueryKeys.USER_ORDERS, address],
        exact: false,
      });
      await GarageService.saveReceipt({
        txId,
        chainId: chainId ?? Networks.MAINNET,
      });
    },
  });

  return { updateOrder, updateOrderAsync, ...rest };
};
