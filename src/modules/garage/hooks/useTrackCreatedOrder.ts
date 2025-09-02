import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { queryClient } from '@/config';
import { useContactToast } from '@/modules/addressBook';
import { useTransactionsSignaturePending } from '@/modules/transactions';

import { GarageQueryKeys } from '../utils/constants';

export const useTrackCreatedOrder = (
  vaultId: string,
  callback?: () => void,
) => {
  const { successToast } = useContactToast();
  const [shouldStartTracking, setShouldStartTracking] = useState(false);
  const { data: pendingTransactions, refetch } =
    useTransactionsSignaturePending([vaultId]);

  // Polling to track if order is created successfully
  useQuery({
    queryKey: [
      GarageQueryKeys.TRACK_ORDER_CREATED,
      vaultId,
      shouldStartTracking,
    ],
    queryFn: async () => {
      if (pendingTransactions) {
        // If we have pending transactions (count > 0), order was created
        if (pendingTransactions.ofUser > 0) {
          successToast({
            title: 'Order created successfully',
            description: 'Your order has been successfully created.',
          });
          callback?.();
          setShouldStartTracking(false);
          queryClient.invalidateQueries({
            queryKey: [GarageQueryKeys.USER_ORDERS],
            exact: false,
          });
          return;
        }
        // Continue polling if no transactions yet
        await refetch();
      }
    },
    enabled: shouldStartTracking && !!pendingTransactions,
    refetchInterval: 2000,
  });

  return {
    startTracking: () => setShouldStartTracking(true),
    pendingTransactions:
      !!pendingTransactions?.ofUser && pendingTransactions?.ofUser > 0,
  };
};
