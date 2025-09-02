import type { Order as OrderFromFuel } from '@garage/sdk';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { useContactToast } from '@/modules/addressBook';
import { useTransactionsSignaturePending } from '@/modules/transactions';

import { GarageQueryKeys } from '../utils/constants';
import { useGarage } from './useGarage';

const useTrackOrderCreated = (vaultId: string, callback: () => void) => {
  const { successToast } = useContactToast();
  const [initialPendingTxCount, setInitialPendingTxCount] = useState<
    number | null
  >(null);
  const { data: pendingTransactions, refetch } =
    useTransactionsSignaturePending([vaultId]);

  // Polling to track if order is created successfully
  useQuery({
    queryKey: [
      GarageQueryKeys.TRACK_ORDER_CREATED,
      vaultId,
      initialPendingTxCount,
    ],
    queryFn: async () => {
      if (pendingTransactions && initialPendingTxCount !== null) {
        if (pendingTransactions.ofUser > initialPendingTxCount) {
          successToast({
            title: 'Order created successfully',
            description: 'Your order has been successfully created.',
          });
          callback();
          return { shouldStop: true };
        }
        // Continue polling if count hasn't increased
        await refetch();
        return { shouldStop: false };
      }
      return { shouldStop: false };
    },
    enabled: !!pendingTransactions && initialPendingTxCount !== null,
    refetchInterval: 2000,
  });

  return {
    setInitialCount: () => {
      if (pendingTransactions) {
        setInitialPendingTxCount(pendingTransactions.ofUser);
      }
    },
    pendingTransactions:
      !!pendingTransactions?.ofUser && pendingTransactions?.ofUser > 0,
  };
};

export const useCreateOrder = (vaultId: string, callback: () => void) => {
  const garageContract = useGarage();
  const { setInitialCount, pendingTransactions } = useTrackOrderCreated(
    vaultId,
    callback,
  );

  const {
    mutate: createOrder,
    mutateAsync: createOrderAsync,
    ...rest
  } = useMutation({
    mutationFn: async (order: OrderFromFuel & { image: string }) => {
      setInitialCount();

      const garage = await garageContract;
      await garage.createOrder(order);
    },
  });

  return { createOrder, createOrderAsync, pendingTransactions, ...rest };
};
