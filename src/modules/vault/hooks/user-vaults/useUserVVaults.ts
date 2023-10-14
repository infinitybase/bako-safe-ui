import { useNavigate } from 'react-router-dom';

import { useUserVaultRequest } from '../useUserVaultRequest';

const useUserVaults = () => {
  const navigate = useNavigate();
  const vaultsRequest = useUserVaultRequest();

  return {
    navigate,
    vaultsRequest: {
      ...vaultsRequest,
      vaults: vaultsRequest.data,
      loadingVaults: vaultsRequest.isFetching,
    },
  };
};

export { useUserVaults };
