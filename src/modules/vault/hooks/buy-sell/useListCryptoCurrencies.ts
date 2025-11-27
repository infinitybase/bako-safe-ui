import { useQuery } from '@tanstack/react-query';

import { VaultService } from '../../services';

export const useListCryptoCurrencies = () => {
  const { data, ...rest } = useQuery({
    queryKey: ['meld/crypto-currencies'],
    queryFn: () => VaultService.getCryptoCurrencies(),
    // Crypto currencies list is immutable - never needs refetch
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return {
    cryptoCurrencies: data ?? [],
    ...rest,
  };
};
