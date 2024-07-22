import { useBakoSafeVault } from '@/modules/core';
import { ordinateMembers } from '../../utils';

const VAULT_DETAIL_QUERY_KEY = 'vault/get';

function useVaultDetailsRequest(id: string) {
  const { vault, ...rest } = useBakoSafeVault(id);

  const predicate = {
    ...vault?.BakoSafeVault,
    members: ordinateMembers(
      vault?.BakoSafeVault.members!,
      vault?.BakoSafeVault.owner!,
    ),
  };

  return {
    ...rest,
    predicate,
    predicateInstance: vault,
    members: vault,
  };
}

export { useVaultDetailsRequest, VAULT_DETAIL_QUERY_KEY };
