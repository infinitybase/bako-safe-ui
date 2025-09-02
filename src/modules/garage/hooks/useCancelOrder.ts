import { useMutation } from '@tanstack/react-query';

import { useGarage } from './useGarage';
import { useTrackCreatedOrder } from './useTrackCreatedOrder';

export const useCancelOrder = (vaultId: string, callback?: () => void) => {
  const marketplaceContract = useGarage();
  const { startTracking, pendingTransactions } = useTrackCreatedOrder(
    vaultId,
    callback,
  );

  const { mutate: cancelOrder, ...rest } = useMutation({
    mutationFn: async (orderId: string) => {
      startTracking();

      const marketplace = await marketplaceContract;
      await marketplace.cancelOrder(orderId);
    },
  });

  return { cancelOrder, pendingTransactions, ...rest };
};
