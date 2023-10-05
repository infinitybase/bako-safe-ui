import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useFuelAccount } from '@/modules';
import { useUserVaultRequest } from '@/modules/vault';

const useHome = () => {
  const navigate = useNavigate();
  const { account } = useFuelAccount();
  const vaultsRequest = useUserVaultRequest();

  const vaults = useMemo(() => {
    const max = 8;
    const userPredicates = vaultsRequest.data;
    const count = userPredicates?.length ?? 0;
    const extraCount = count <= max ? 0 : count - max;
    const recentVaults =
      count <= max ? userPredicates : userPredicates?.slice(0, max);

    return { recentVaults, extraCount, vaultsMax: max };
  }, [vaultsRequest.data]);

  return {
    account,
    vaultsRequest: { ...vaultsRequest, vaults },
    navigate,
  };
};

export { useHome };
