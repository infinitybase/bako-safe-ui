import { useMutation } from "@tanstack/react-query";

import {
  DAppService,
  IDAppCreatePayload,
} from "@bako-safe/services/modules/dapp";

const useCreateConnections = () => {
  return useMutation({
    mutationFn: (params: IDAppCreatePayload) => DAppService.create(params),
    onSuccess: () => {
      window.close();
    },
  });
};

export { useCreateConnections };
