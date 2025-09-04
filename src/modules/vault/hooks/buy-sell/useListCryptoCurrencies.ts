import { useQuery } from '@tanstack/react-query';

import { VaultService } from '../../services';

export const useListCryptoCurrencies = () => {
  const { data, ...rest } = useQuery({
    queryKey: ['meld/crypto-currencies'],
    queryFn: () => VaultService.getCryptoCurrencies(),
  });

  return {
    cryptoCurrencies: data ?? [],
    ...rest,
  };
};
