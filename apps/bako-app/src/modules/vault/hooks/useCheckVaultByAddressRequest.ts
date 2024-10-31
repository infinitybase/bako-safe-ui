import { useQuery } from '@tanstack/react-query';

import { vaultService } from '@/modules/services/services-initializer';

export const VAULT_BY_ADDRESS_QUERY_KEY = 'predicate/check/by-address';

export type UseCheckVaultByAddressRequest = ReturnType<
  typeof useCheckVaultByAddressRequest
>;

const useCheckVaultByAddressRequest = (address: string, enabled: boolean) => {
  return useQuery({
    queryKey: [VAULT_BY_ADDRESS_QUERY_KEY, address],
    queryFn: () => vaultService.checkByAddress(address),
    refetchOnWindowFocus: false,
    enabled,
  });
};

export { useCheckVaultByAddressRequest };
