import { useQuery } from '@tanstack/react-query';

import { VaultService } from '../../services';

export const useListFiatCurrencies = () => {
  const { data, ...rest } = useQuery({
    queryKey: ['meld/fiat-currencies'],
    queryFn: () => VaultService.getFiatCurrencies(),
    // Fiat currencies list is immutable - never needs refetch
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    fiatCurrencies: data ?? [],
    ...rest,
  };
};
