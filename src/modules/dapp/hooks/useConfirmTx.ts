import { useMutation } from 'react-query';

import { DAppService, IDAPPConfirmTx } from '../services';

const useConfirmTx = () => {
  return useMutation(
    (params: IDAPPConfirmTx) => DAppService.confirmTx(params),
    {
      onSuccess: () => {
        // todo: close this window
      },
    },
  );
};

export { useConfirmTx };
