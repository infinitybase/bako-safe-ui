import type { UpdateOrder } from '@garage/sdk';
import { useMutation } from '@tanstack/react-query';

import { useGarage } from './useGarage';
import { useTrackCreatedOrder } from './useTrackCreatedOrder';

type TUpdateOrder = UpdateOrder & {
  orderId: string;
};

export const useUpdateOrder = (vaultId: string, callback: () => void) => {
  const garageContract = useGarage();
  const { startTracking, pendingTransactions } = useTrackCreatedOrder(
    vaultId,
    callback,
  );
  const {
    mutate: updateOrder,

    ...rest
  } = useMutation({
    mutationFn: async ({ orderId, ...data }: TUpdateOrder) => {
      startTracking();
      const marketplace = await garageContract;
      await marketplace.updateOrder(orderId, data);
    },
  });

  return { updateOrder, pendingTransactions, ...rest };
};
