import { useMutation } from 'react-query';

import { DAppService } from '../services';
import { IDAppCreatePayload } from '../services/methods';

const useCreateConnections = () => {
  return useMutation(
    (params: IDAppCreatePayload) => DAppService.create(params),
    {
      onSuccess: () => {
        // todo: close this window
      },
    },
  );
};

export { useCreateConnections };
