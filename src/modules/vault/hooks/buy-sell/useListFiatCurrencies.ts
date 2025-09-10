import { useQuery } from '@tanstack/react-query';

import { VaultService } from '../../services';

export const useListFiatCurrencies = () => {
  const { data, ...rest } = useQuery({
    queryKey: ['meld/fiat-currencies'],
    queryFn: () => VaultService.getFiatCurrencies(),
  });

  return {
    fiatCurrencies: data ?? [],
    ...rest,
  };
};
