import { useQuery } from '@tanstack/react-query';

import { VaultService } from '../../services';

export const useListMeldProviders = () => {
  const { data, ...rest } = useQuery({
    queryKey: ['meld/providers'],
    queryFn: () => VaultService.getServiceProviders(),
  });

  return {
    providers: data ?? [],
    ...rest,
  };
};
