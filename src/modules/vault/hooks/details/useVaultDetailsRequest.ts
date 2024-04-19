import { useBakoSafeVault } from '@/modules/core';

const VAULT_DETAIL_QUERY_KEY = 'vault/get';

function useVaultDetailsRequest(id: string) {
  const { vault, ...rest } = useBakoSafeVault(id);

  return {
    ...rest,
    predicate: vault?.BakoSafeVault,
    predicateInstance: vault,
  };
}

export { useVaultDetailsRequest, VAULT_DETAIL_QUERY_KEY };
