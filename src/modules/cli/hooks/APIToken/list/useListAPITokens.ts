import { useParams } from 'react-router-dom';

import { useGetAPITokensRequest } from '.';

const useListAPITokens = () => {
  const { vaultId } = useParams<{ workspaceId: string; vaultId: string }>();

  const request = useGetAPITokensRequest(vaultId!);

  return {
    request,
  };
};

export { useListAPITokens };
