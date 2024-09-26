import { useQuery } from '@tanstack/react-query';

import { VaultService } from '../services';

export const VAULT_BY_ADDRESS_QUERY_KEY = 'predicate/by-address';

export type UseVaultByAddressRequest = ReturnType<
  typeof useVaultByAddressRequest
>;

const useVaultByAddressRequest = (address: string, enabled: boolean) => {
  return useQuery({
    queryKey: [VAULT_BY_ADDRESS_QUERY_KEY, address],
    queryFn: () => VaultService.getByAddress(address),
    refetchOnWindowFocus: false,
    enabled,
  });
};

export { useVaultByAddressRequest };
