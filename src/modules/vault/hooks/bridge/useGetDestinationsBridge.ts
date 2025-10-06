import { useMutation } from '@tanstack/react-query';

import { IGetDestinationPayload } from '@/modules/core';

import { VaultService } from '../../services';

export const useGetDestinationsBridge = () => {
  const {
    mutateAsync: getDestinationsBridgeAsync,
    mutate: getDestinationsBridge,
    ...rest
  } = useMutation({
    mutationFn: async (data: IGetDestinationPayload) => {
      return VaultService.getDestinationsBridge(data);
    },
  });

  return { getDestinationsBridgeAsync, getDestinationsBridge, ...rest };
};
