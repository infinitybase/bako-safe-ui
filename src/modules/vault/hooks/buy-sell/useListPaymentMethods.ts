import { useQuery } from '@tanstack/react-query';

import { VaultService } from '../../services';

export const useListPaymentMethods = () => {
  const { data, ...rest } = useQuery({
    queryKey: ['meld/payment-methods'],
    queryFn: () => VaultService.getPaymentMethods(),
    // Payment methods list is immutable - never needs refetch
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    paymentMethods: data ?? [],
    ...rest,
  };
};
