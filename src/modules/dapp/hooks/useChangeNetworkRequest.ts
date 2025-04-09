import { useMutation } from '@tanstack/react-query';

import { DAppService } from '../services';
import { IDAPPChangeNetwork } from '../services/methods';

const useChangeNetworkRequest = () => {
  return useMutation({
    mutationFn: (params: IDAPPChangeNetwork) =>
      DAppService.changeNetwork(params),
  });
};

export { useChangeNetworkRequest };
