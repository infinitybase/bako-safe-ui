import { dappService } from '@app/modules/services/services-initializer';
import { IDAppCreatePayload } from '@bako-safe/services/modules/dapp';
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
