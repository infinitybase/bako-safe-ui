import { useQuery } from '@tanstack/react-query';
import { Network } from 'fuels';

import { instantiateVault } from '../instantiateVault';

const VAULT_QUERY_KEYS = {
  DEFAULT: ['bakosafe', 'vault'],
  VAULT: (id: string) => [...VAULT_QUERY_KEYS.DEFAULT, id],
};

interface IUseBakoSafeGetVault {
  predicateAddress: string;
  id: string;
  workspaceId: string;
  network: Network;
  token: string;
  userAddress: string;
  serverApi: string;
}

const useBakoSafeGetVault = ({
  predicateAddress,
  id,
  workspaceId,
  network,
  serverApi,
  token,
  userAddress,
}: IUseBakoSafeGetVault) => {
  const query = useQuery({
    queryKey: [...VAULT_QUERY_KEYS.VAULT(id), workspaceId, network],
    queryFn: () => {
      const vault = instantiateVault({
        predicateAddress,
        providerUrl: network.url,
        token,
        userAddress,
        serverApi,
      });
      return vault;
    },
    enabled: !!id,
  });

  return {
    vault: query.data,
    ...query,
  };
};
export { useBakoSafeGetVault };
