import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const useGetParams = () => {
  const { pathname } = useLocation();
  const pathnameParts = pathname.split('/');
  const getPathParam = useCallback(
    (key: string) => {
      const index = pathnameParts.indexOf(key);
      return index !== -1 && index + 1 < pathnameParts.length
        ? pathnameParts[index + 1]
        : null;
    },
    [pathnameParts],
  );

  const vaultId = useMemo(() => getPathParam('vault'), [getPathParam]);
  const workspaceId = useMemo(() => getPathParam('workspace'), [getPathParam]);

  const vaultPageParams = {
    vaultId: vaultId !== 'me' ? vaultId : undefined,
    workspaceId,
  };

  return { vaultPageParams, getPathParam };
};

export { useGetParams };
