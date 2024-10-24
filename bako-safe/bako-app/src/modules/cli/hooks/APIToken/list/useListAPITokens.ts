import { useGetAPITokensRequest } from '.';

const useListAPITokens = (vaultId: string, hasPermission: boolean) => {
  const request = useGetAPITokensRequest(vaultId!, hasPermission);

  return {
    request,
  };
};

export { useListAPITokens };
