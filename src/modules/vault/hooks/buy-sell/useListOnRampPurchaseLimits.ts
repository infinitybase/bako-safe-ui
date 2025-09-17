import { useQuery } from '@tanstack/react-query';

import { IPurchaseLimitsParams } from '@/modules/core/models/meld';

import { VaultService } from '../../services';

export const useListOnRampPurchaseLimits = (params?: IPurchaseLimitsParams) => {
  const { data, ...rest } = useQuery({
    queryKey: ['meld/buy-purchase-limits'],
    queryFn: () => VaultService.getOnRampPurchaseLimits(params),
  });

  return {
    purchaseLimits: data ?? [],
    ...rest,
  };
};
