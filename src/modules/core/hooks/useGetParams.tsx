import { useLocation } from 'react-router-dom';

const useGetParams = () => {
  const { pathname } = useLocation();
  const pathnameParts = pathname.split('/');
  const getPathParam = (key: string) => {
    const index = pathnameParts.indexOf(key);
    return index !== -1 && index + 1 < pathnameParts.length
      ? pathnameParts[index + 1]
      : null;
  };

  const vaultId = getPathParam('vault');
  const workspaceId = getPathParam('workspace');

  const vaultPageParams = {
    vaultId,
    workspaceId,
  };

  return { vaultPageParams, getPathParam };
};

export { useGetParams };
