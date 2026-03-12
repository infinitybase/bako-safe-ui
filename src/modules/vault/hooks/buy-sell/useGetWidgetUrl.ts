import { useQuery } from '@tanstack/react-query';

import { VaultService } from '../../services';

export const useGetWidgetUrl = (id: string) => {
  return useQuery({
    queryKey: ['meld/widget', id],
    queryFn: () => VaultService.getWidgetUrl(id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
