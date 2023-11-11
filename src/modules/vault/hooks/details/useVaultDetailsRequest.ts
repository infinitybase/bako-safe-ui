import { useBsafeVault } from '@/modules/core';

const VAULT_DETAIL_QUERY_KEY = 'vault/get';

function useVaultDetailsRequest(id: string) {
  const { vault, ...rest } = useBsafeVault(id);

  return {
    ...rest,
    predicate: vault?.BSAFEVault,
    predicateInstance: vault,
  };
}

export { useVaultDetailsRequest, VAULT_DETAIL_QUERY_KEY };
