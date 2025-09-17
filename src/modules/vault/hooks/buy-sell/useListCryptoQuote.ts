import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { IQuotePayload, IQuoteResponse } from '@/modules/core/models/meld';

import { VaultService } from '../../services';

interface useListCryptoQuoteProps
  extends Omit<UseQueryOptions<IQuoteResponse>, 'queryKey' | 'queryFn'> {
  params: IQuotePayload;
}

export const useListCryptoQuote = (options: useListCryptoQuoteProps) => {
  const { data: quotes, ...rest } = useQuery({
    queryKey: ['meld/crypto-quote', options.params],
    queryFn: () => VaultService.getCryptoQuote(options.params),
    ...options,
  });

  return { quotes, ...rest };
};
