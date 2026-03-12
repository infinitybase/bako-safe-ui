import { useQuery } from '@tanstack/react-query';

import { IPurchaseLimitsParams } from '@/modules/core/models/meld';

import { VaultService } from '../../services';

export const useListOffRampPurchaseLimits = (
  params?: IPurchaseLimitsParams,
) => {
  const { data, ...rest } = useQuery({
    queryKey: ['meld/sell-purchase-limits'],
    queryFn: () => VaultService.getOffRampPurchaseLimits(params),
  });

  return {
    purchaseLimits: data ?? [],
    ...rest,
  };
};
