import { dappService } from '@app/config/services-initializer';
import type { IDAppCreatePayload } from '@bako-safe/services';
import { useMutation } from '@tanstack/react-query';

const useCreateConnections = () => {
  return useMutation({
    mutationFn: (params: IDAppCreatePayload) => dappService.create(params),
    onSuccess: () => {
      window.close();
    },
  });
};

export { useCreateConnections };
