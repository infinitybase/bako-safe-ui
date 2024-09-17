import { useNavigate } from 'react-router-dom';

import { Pages } from '@/modules';

const useRedirectToRootWallet = () => {
  const navigate = useNavigate();

  const handleRedirectToRootWallet = (vaultId: string, workspaceId: string) => {
    navigate(
      Pages.detailsVault({
        vaultId: vaultId ?? '',
        workspaceId: workspaceId ?? '',
      }),
    );
  };

  return {
    handleRedirectToRootWallet,
  };
};
export { useRedirectToRootWallet };
