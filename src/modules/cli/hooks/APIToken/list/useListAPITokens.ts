import { useParams } from 'react-router-dom';

import { useGetAPITokensRequest } from '.';

const useListAPITokens = (hasPermission: boolean) => {
  const { vaultId } = useParams<{ workspaceId: string; vaultId: string }>();

  const request = useGetAPITokensRequest(vaultId!, hasPermission);

  return {
    request,
  };
};

export { useListAPITokens };
