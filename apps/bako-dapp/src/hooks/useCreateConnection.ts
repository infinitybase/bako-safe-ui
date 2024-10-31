import { useMutation } from "@tanstack/react-query";

import { IDAppCreatePayload } from "@bako-safe/services/modules/dapp";

const useCreateConnections = () => {
  return useMutation({
    mutationFn: (params: IDAppCreatePayload) => dappService.create(params),
    onSuccess: () => {
      window.close();
    },
  });
};

export { useCreateConnections };
