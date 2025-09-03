import { useQuery } from '@tanstack/react-query';

import { VaultService } from '../../services';

export const useListPaymentMethods = () => {
  const { data, ...rest } = useQuery({
    queryKey: ['meld/payment-methods'],
    queryFn: () => VaultService.getPaymentMethods(),
  });

  return {
    paymentMethods: data ?? [],
    ...rest,
  };
};
