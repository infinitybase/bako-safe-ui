import { useMutation } from '@tanstack/react-query';

import { DAppService } from '../services';
import { IDAppCreatePayload } from '../services/methods';

const useCreateConnections = () => {
  return useMutation({
    mutationFn: (params: IDAppCreatePayload) => DAppService.create(params),
    onSuccess: () => {
      window.close();
    },
  });
};

export { useCreateConnections };
