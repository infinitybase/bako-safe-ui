import type { Order as OrderFromFuel } from '@garage/sdk';
import { useMutation } from '@tanstack/react-query';

import { useGarage } from './useGarage';
import { useTrackCreatedOrder } from './useTrackCreatedOrder';

export const useCreateOrder = (vaultId: string, callback?: () => void) => {
  const garageContract = useGarage();
  const { startTracking, pendingTransactions } = useTrackCreatedOrder(
    vaultId,
    callback,
  );

  const { mutate: createOrder, ...rest } = useMutation({
    mutationFn: async (order: OrderFromFuel & { image: string }) => {
      startTracking();

      const garage = await garageContract;
      await garage.createOrder(order);
    },
  });

  return { createOrder, pendingTransactions, ...rest };
};
